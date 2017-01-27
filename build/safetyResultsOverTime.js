var safetyResultsOverTime = function (webcharts, d3$1) {
    'use strict';

    if (typeof Object.assign != 'function') {
        (function () {
            Object.assign = function (target) {
                'use strict';

                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }

    var defaultSettings = {
        //Custom settings for this template
        id_col: 'USUBJID',
        time_settings: {
            value_col: 'VISITN',
            label: 'Visit Number',
            order: null, // x-axis domain order (array)
            rotate_tick_labels: false,
            vertical_space: 0 },
        measure_col: 'TEST',
        value_col: 'STRESN',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        start_value: null,
        groups: [{ value_col: 'NONE', label: 'None' }, { value_col: 'SEX', label: 'Sex' }, { value_col: 'RACE', label: 'Race' }],
        filters: null,
        boxplots: true,
        violins: false,
        missingValues: ['', 'NA', 'N/A'],

        //Standard webcharts settings
        x: {
            column: null, // set in syncSettings()
            type: 'ordinal',
            label: null,
            behavior: 'flex',
            sort: 'alphabetical-ascending',
            tickAttr: null
        },
        y: {
            column: null, // set in syncSettings()
            type: 'linear',
            label: null,
            behavior: 'flex',
            stat: 'mean',
            format: '0.2f'
        },
        marks: [{
            type: 'line',
            per: null, // set in syncSettings()
            attributes: {
                'stroke-width': 2,
                'stroke-opacity': 1,
                'display': 'none'
            }
        }],
        legend: {
            mark: 'square'
        },
        color_by: null, // set in syncSettings()
        resizable: false,
        gridlines: 'xy',
        aspect: 3
    };

    // Replicate settings in multiple places in the settings object
    function syncSettings(settings) {
        settings.x.column = settings.time_settings.value_col;
        settings.x.label = settings.time_settings.label;
        settings.x.order = settings.time_settings.order;
        settings.y.column = settings.value_col;
        if (settings.groups) settings.color_by = settings.groups[0].value_col ? settings.groups[0].value_col : settings.groups[0];else settings.color_by = 'NONE';
        settings.marks[0].per = [settings.color_by];
        settings.margin = settings.margin || { bottom: settings.time_settings.vertical_space };

        return settings;
    }

    // Default Control objects
    var controlInputs = [{
        type: 'subsetter',
        label: 'Measure',
        value_col: null, // set in syncControlInputs()
        start: null // set in syncControlInputs()
    }, {
        type: 'dropdown',
        label: 'Group',
        options: ['marks.0.per.0', 'color_by'],
        start: null, // set in syncControlInputs()
        values: null, // set in syncControlInputs()
        require: true
    }, {
        type: 'radio',
        label: 'Hide visits with no data: ',
        option: 'x.behavior',
        values: ['flex', 'raw'],
        relabels: ['Yes', 'No'],
        require: true
    }, { type: 'checkbox', option: 'boxplots', label: 'Box Plots', inline: true }, { type: 'checkbox', option: 'violins', label: 'Violin Plots', inline: true }];

    // Map values from settings to control inputs
    function syncControlInputs(controlInputs, settings) {
        //Sync measure control.
        var measureControl = controlInputs.filter(function (controlInput) {
            return controlInput.label === 'Measure';
        })[0];
        measureControl.value_col = settings.measure_col;
        measureControl.start = settings.start_value;

        //Sync group control.
        var groupControl = controlInputs.filter(function (controlInput) {
            return controlInput.label === 'Group';
        })[0];
        groupControl.start = settings.color_by;
        if (settings.groups) groupControl.values = settings.groups.map(function (group) {
            return group.value_col ? group.value_col : group;
        });

        //Add custom filters to control inputs.
        if (settings.filters) settings.filters.reverse().forEach(function (filter) {
            return controlInputs.splice(2, 0, { type: 'subsetter',
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter });
        });

        return controlInputs;
    }

    function onInit() {
        var _this = this;

        var config = this.config;
        var allMeasures = d3$1.set(this.raw_data.map(function (m) {
            return m[config.measure_col];
        })).values();

        //'All'variable for non-grouped comparisons
        this.raw_data.forEach(function (e) {
            return e.NONE = 'All Subjects';
        });

        //Drop missing values
        this.raw_data = this.raw_data.filter(function (f) {
            return config.missingValues.indexOf(f[config.value_col]) === -1;
        });

        //warning for non-numeric endpoints
        var catMeasures = allMeasures.filter(function (f) {
            var measureVals = _this.raw_data.filter(function (d) {
                return d[config.measure_col] === f;
            });

            return webcharts.dataOps.getValType(measureVals, config.value_col) !== 'continuous';
        });
        if (catMeasures.length) {
            console.warn(catMeasures.length + ' non-numeric endpoints have been removed: ' + catMeasures.join(', '));
        }

        //delete non-numeric endpoints
        var numMeasures = allMeasures.filter(function (f) {
            var measureVals = _this.raw_data.filter(function (d) {
                return d[config.measure_col] === f;
            });

            return webcharts.dataOps.getValType(measureVals, config.value_col) === 'continuous';
        });

        this.raw_data = this.raw_data.filter(function (f) {
            return numMeasures.indexOf(f[config.measure_col]) > -1;
        });

        //Choose the start value for the Test filter
        this.controls.config.inputs.filter(function (input) {
            return input.label === 'Measure';
        })[0].start = this.config.start_value || numMeasures[0];
    };

    function onLayout() {}

    function onDataTransform() {
        //Redefine y-axis label.
        this.config.y.label = this.filtered_data[0][this.config.measure_col] + ' (' + this.filtered_data[0][this.config.unit_col] + ')';
        //Redefine legend label.
        var group_value_cols = this.config.groups.map(function (group) {
            return group.value_col ? group.value_col : group;
        });
        var group_labels = this.config.groups.map(function (group) {
            return group.label ? group.label : group.value_col ? group.value_col : group;
        });
        var group = this.config.color_by;
        if (group !== 'NONE') this.config.legend.label = group_labels[group_value_cols.indexOf(group)];else this.config.legend.label = '';
    }

    function onDraw() {
        var _this = this;

        this.marks[0].data.forEach(function (e) {
            e.values.sort(function (a, b) {
                return a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : d3$1.ascending(a.key, b.key);
            });
        });

        var sortVar = this.config.x.column;

        // Make nested data set for boxplots
        this.nested_data = d3$1.nest().key(function (d) {
            return d[_this.config.x.column];
        }).key(function (d) {
            return d[_this.config.marks[0].per[0]];
        }).rollup(function (d) {
            return d.map(function (m) {
                return +m[_this.config.y.column];
            });
        }).entries(this.filtered_data);

        // y-domain for box plots
        var y_05s = [];
        var y_95s = [];
        this.nested_data.forEach(function (e) {
            e.values.forEach(function (v, i) {
                var results = v.values.sort(d3$1.ascending);
                y_05s.push(d3$1.quantile(results, 0.05));
                y_95s.push(d3$1.quantile(results, 0.95));
            });
        });
        this.y_dom[0] = Math.min.apply(null, y_05s);
        this.y_dom[1] = Math.max.apply(null, y_95s);

        if (this.config.violins) {
            this.y_dom = d3$1.extent(this.filtered_data.map(function (m) {
                return +m[_this.config.y.column];
            }));
        }
    }

    function addBoxplot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor) {
        var format = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : '.2f';
        var horizontal = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;

        //Make the numericResults numeric and sort.
        var numericResults = results.map(function (d) {
            return +d;
        }).sort(d3.ascending);

        //Define x - and y - scales.
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        if (horizontal) y.domain(domain);else x.domain(domain);

        //Define quantiles of interest.
        var probs = [0.05, 0.25, 0.5, 0.75, 0.95],
            iS = void 0;
        for (var _i = 0; _i < probs.length; _i++) {
            probs[_i] = d3.quantile(numericResults, probs[_i]);
        }

        //Define box plot container.
        var boxplot = svg.append('g').attr('class', 'boxplot').datum({ values: numericResults,
            probs: probs });

        //Define box dimensions.
        var left = horizontal ? 0.5 - boxPlotWidth / 2 : null;
        var right = horizontal ? 0.5 + boxPlotWidth / 2 : null;
        var top = horizontal ? null : 0.5 - boxPlotWidth / 2;
        var bottom = horizontal ? null : 0.5 + boxPlotWidth / 2;

        //Transform box dimensions.
        var box_x = horizontal ? x(left) : x(probs[1]);
        var box_width = horizontal ? x(right) - x(left) : x(probs[3]) - x(probs[1]);
        var box_y = horizontal ? y(probs[3]) : y(right);
        var box_height = horizontal ? -y(probs[3]) + y(probs[1]) : y(left) - y(right);

        //Draw box.
        boxplot.append('rect').attr({ 'class': 'boxplot fill',
            'x': box_x,
            'width': box_width,
            'y': box_y,
            'height': box_height }).style('fill', boxColor);

        //Draw horizontal lines at 5th percentile, median, and 95th percentile.
        iS = [0, 2, 4];
        var iSclass = ['', 'median', ''];
        var iSColor = [boxColor, boxInsideColor, boxColor];
        for (var _i2 = 0; _i2 < iS.length; _i2++) {
            boxplot.append('line').attr({ 'class': 'boxplot ' + iSclass[_i2],
                'x1': horizontal ? x(left) : x(probs[iS[_i2]]),
                'x2': horizontal ? x(right) : x(probs[iS[_i2]]),
                'y1': horizontal ? y(probs[iS[_i2]]) : y(left),
                'y2': horizontal ? y(probs[iS[_i2]]) : y(right) }).style({ 'fill': iSColor[_i2],
                'stroke': iSColor[_i2] });
        }

        //Draw vertical lines from the 5th percentile to the 25th percentile and from the 75th percentile to the 95th percentile.
        iS = [[0, 1], [3, 4]];
        for (var i = 0; i < iS.length; i++) {
            boxplot.append('line').attr({ 'class': 'boxplot',
                'x1': horizontal ? x(0.5) : x(probs[iS[i][0]]),
                'x2': horizontal ? x(0.5) : x(probs[iS[i][1]]),
                'y1': horizontal ? y(probs[iS[i][0]]) : y(0.5),
                'y2': horizontal ? y(probs[iS[i][1]]) : y(0.5) }).style('stroke', boxColor);
        }

        //Draw outer circle.
        boxplot.append('circle').attr({ 'class': 'boxplot mean',
            'cx': horizontal ? x(0.5) : x(d3.mean(numericResults)),
            'cy': horizontal ? y(d3.mean(numericResults)) : y(0.5),
            'r': horizontal ? x(boxPlotWidth / 3) : y(1 - boxPlotWidth / 3) }).style({ 'fill': boxInsideColor,
            'stroke': boxColor });

        //Draw inner circle.
        boxplot.append('circle').attr({ 'class': 'boxplot mean',
            'cx': horizontal ? x(0.5) : x(d3.mean(numericResults)),
            'cy': horizontal ? y(d3.mean(numericResults)) : y(0.5),
            'r': horizontal ? x(boxPlotWidth / 6) : y(1 - boxPlotWidth / 6) }).style({ 'fill': boxColor,
            'stroke': 'None' });

        //Annotate statistics.
        var xFormat = d3.format(format);
        boxplot.selectAll('.boxplot').append('title').text(function (d) {
            return 'N = ' + d.values.length + '\nMin = ' + d3.min(d.values) + '\n5th % = ' + xFormat(d3.quantile(d.values, 0.05)) + '\nQ1 = ' + xFormat(d3.quantile(d.values, 0.25)) + '\nMedian = ' + xFormat(d3.median(d.values)) + '\nQ3 = ' + xFormat(d3.quantile(d.values, 0.75)) + '\n95th % = ' + xFormat(d3.quantile(d.values, 0.95)) + '\nMax = ' + d3.max(d.values) + '\nMean = ' + xFormat(d3.mean(d.values)) + '\nStDev = ' + xFormat(d3.deviation(d.values));
        });
    }

    function addViolin(svg, results, height, width, domain, imposeMax, violinColor) {
        var interpolation = "basis";

        var data = d3.layout.histogram().bins(10).frequency(0)(results);

        var y = d3.scale.linear().range([width / 2, 0]).domain([0, Math.max(imposeMax, d3.max(data, function (d) {
            return d.y;
        }))]).clamp(true);

        var x = d3.scale.linear().range([height, 0]).domain(domain);
        //.nice() ;


        var area = d3.svg.area().interpolate(interpolation).x(function (d) {
            if (interpolation == "step-before") return x(d.x + d.dx / 2);
            return x(d.x);
        }).y0(width / 2).y1(function (d) {
            return y(d.y);
        });

        var line = d3.svg.line().interpolate(interpolation).x(function (d) {
            if (interpolation == "step-before") return x(d.x + d.dx / 2);
            return x(d.x);
        }).y(function (d) {
            return y(d.y);
        });

        var gPlus = svg.append("g");
        var gMinus = svg.append("g");

        gPlus.append("path").datum(data).attr("class", "area").attr("d", area).attr("fill", violinColor);

        gPlus.append("path").datum(data).attr("class", "violin").attr("d", line).attr("stroke", violinColor).attr("fill", "none");

        gMinus.append("path").datum(data).attr("class", "area").attr("d", area).attr("fill", violinColor);

        gMinus.append("path").datum(data).attr("class", "violin").attr("d", line).attr("stroke", violinColor).attr("fill", "none");

        gPlus.attr("transform", "rotate(90,0,0)  translate(0,-" + width + ")"); //translate(0,-200)");
        gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");
    };

    function onResize() {
        var _this = this;

        var config = this.config;

        //Rotate x-axis tick labels.
        if (config.time_settings.rotate_tick_labels) this.svg.selectAll('.x.axis .tick text').attr({ 'transform': 'rotate(-45)',
            'dx': -10,
            'dy': 10 }).style('text-anchor', 'end');

        //Draw reference boxplot.
        this.svg.selectAll('.boxplot-wrap').remove();

        //Count number of groups.
        var nGroups = this.colorScale.domain().length;
        //Given an odd number of groups, center first box and offset the rest.
        //Given an even number of groups, offset all boxes.
        var start = nGroups % 2 ? 0 : 1;
        var width = this.x.rangeBand();

        this.nested_data.forEach(function (e) {
            //Sort [ config.color_by ] groups.
            e.values = e.values.sort(function (a, b) {
                return _this.colorScale.domain().indexOf(a.key) < _this.colorScale.domain().indexOf(b.key) ? -1 : 1;
            });

            e.values.forEach(function (v, i) {
                //Calculate direction in which to offset each box plot.
                var direction = i > 0 ? Math.pow(-1, i % 2) * (start ? 1 : -1) : start;
                //Calculate multiplier of offset distance.
                var multiplier = Math.round((i + start) / 2);
                //Calculate offset distance as a function of the x-axis range band, number of groups, and whether
                //the number of groups is even or odd.
                var distance = width / nGroups;
                var distanceOffset = start * -1 * direction * width / nGroups / 2;
                //Calculate offset.
                var offset = direction * multiplier * distance + distanceOffset;
                //Capture all results within visit and group.
                var results = v.values.sort(d3$1.ascending).map(function (d) {
                    return +d;
                });

                if (_this.x_dom.indexOf(e.key) > -1) {
                    var g = _this.svg.append('g').attr('class', 'boxplot-wrap overlay-item').attr('transform', 'translate(' + (_this.x(e.key) + offset) + ',0)').datum({ values: results });

                    if (config.boxplots) {
                        addBoxplot(g, //svg
                        results, //results 
                        _this.plot_height, //height 
                        width, //width 
                        _this.y.domain(), //domain 
                        .75 / nGroups, //boxPlotWidth 
                        _this.colorScale(v.key), //boxColor 
                        '#eee' //boxInsideColor 
                        );
                    }

                    if (config.violins) {
                        addViolin(g, //svg
                        results, //results
                        _this.plot_height, //height
                        width, //width
                        _this.y.domain(), //domain
                        1 / nGroups / 3, //violinPlotWidth
                        '#ccc7d6' //violinPlotColor
                        );
                    }
                }
            });
        });
    }

    function safetyResultsOverTime(element, settings) {

        //Merge user settings onto default settings.
        var mergedSettings = Object.assign({}, defaultSettings, settings);

        //Sync properties within merged settings, e.g. data mappings.
        mergedSettings = syncSettings(mergedSettings);

        //Sync merged settings with controls.
        var syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);
        var controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs });

        //Define chart.
        var chart = webcharts.createChart(element, mergedSettings, controls);
        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('datatransform', onDataTransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        return chart;
    }

    return safetyResultsOverTime;
}(webCharts, d3);

