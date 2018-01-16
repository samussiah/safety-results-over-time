(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('webcharts'), require('d3')))
        : typeof define === 'function' && define.amd
          ? define(['webcharts', 'd3'], factory)
          : (global.safetyResultsOverTime = factory(global.webCharts, global.d3));
})(this, function(webcharts, d3) {
    'use strict';

    if (typeof Object.assign != 'function') {
        (function() {
            Object.assign = function(target) {
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
            value_col: 'VISIT',
            label: 'Visit',
            order_col: 'VISITNUM',
            order: null,
            rotate_tick_labels: true,
            vertical_space: 100
        },
        measure_col: 'TEST',
        value_col: 'STRESN',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        start_value: null,
        filters: null,
        groups: null,
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
        marks: [
            {
                type: 'line',
                per: null, // set in syncSettings()
                attributes: {
                    'stroke-width': 2,
                    'stroke-opacity': 1,
                    display: 'none'
                }
            }
        ],
        legend: {
            mark: 'square'
        },
        color_by: null, // set in syncSettings()
        resizable: true,
        gridlines: 'y',
        aspect: 3
    };

    // Replicate settings in multiple places in the settings object
    function syncSettings(settings) {
        settings.x.column = settings.time_settings.value_col;
        settings.x.label = settings.time_settings.label;
        settings.y.column = settings.value_col;
        if (!(settings.groups instanceof Array && settings.groups.length))
            settings.groups = [{ value_col: 'NONE', label: 'None' }];
        settings.color_by = settings.groups[0].value_col
            ? settings.groups[0].value_col
            : settings.groups[0];
        settings.marks[0].per = [settings.color_by];
        settings.margin = settings.margin || { bottom: settings.time_settings.vertical_space };

        return settings;
    }

    // Default Control objects
    var controlInputs = [
        {
            type: 'subsetter',
            label: 'Measure',
            description: 'filter',
            value_col: null, // set in syncControlInputs()
            start: null // set in syncControlInputs()
        },
        {
            type: 'dropdown',
            label: 'Group',
            description: 'stratification',
            options: ['marks.0.per.0', 'color_by'],
            start: null, // set in syncControlInputs()
            values: ['NONE'], // set in syncControlInputs()
            require: true
        },
        { type: 'number', label: 'Lower Limit', option: 'y.domain[0]', require: true },
        { type: 'number', label: 'Upper Limit', option: 'y.domain[1]', require: true },
        {
            type: 'radio',
            label: 'Hide visits with no data:',
            option: 'x.behavior',
            values: ['flex', 'raw'],
            relabels: ['Yes', 'No'],
            require: true
        },
        { type: 'checkbox', option: 'boxplots', label: 'Box plots', inline: true },
        { type: 'checkbox', option: 'violins', label: 'Violin plots', inline: true }
    ];

    // Map values from settings to control inputs
    function syncControlInputs(controlInputs, settings) {
        var measureControl = controlInputs.filter(function(controlInput) {
                return controlInput.label === 'Measure';
            })[0],
            groupControl = controlInputs.filter(function(controlInput) {
                return controlInput.label === 'Group';
            })[0];

        //Sync measure control.
        measureControl.value_col = settings.measure_col;
        measureControl.start = settings.start_value;

        //Sync group control.
        groupControl.start = settings.color_by;
        settings.groups
            .filter(function(group) {
                return group.value_col !== 'NONE';
            })
            .forEach(function(group) {
                groupControl.values.push(group.value_col || group);
            });

        //Add custom filters to control inputs.
        if (settings.filters) {
            settings.filters.reverse().forEach(function(filter) {
                var thisFilter = {
                    type: 'subsetter',
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col ? filter.value_col : filter,
                    description: 'filter'
                };

                //add the filter to the control inputs (as long as it's not already there)
                //add the filter to the control inputs (as long as it isn't already there)
                var current_value_cols = controlInputs
                    .filter(function(f) {
                        return f.type == 'subsetter';
                    })
                    .map(function(m) {
                        return m.value_col;
                    });
                if (current_value_cols.indexOf(thisFilter.value_col) == -1)
                    controlInputs.splice(1, 0, thisFilter);
            });
        }
        return controlInputs;
    }

    function defineVisitOrder() {
        var _this = this;

        //Given an ordering variable sort a unique set of visits by the ordering variable.
        if (
            this.config.time_settings.order_col &&
            this.raw_data[0].hasOwnProperty(this.config.time_settings.order_col)
        ) {
            var visits = d3
                    .set(
                        this.raw_data.map(function(d) {
                            return (
                                d[_this.config.time_settings.order_col] +
                                '|' +
                                d[_this.config.time_settings.value_col]
                            );
                        })
                    )
                    .values(),
                // concatenate visit order variable and visit
                visitOrder = visits
                    .sort(function(a, b) {
                        var aOrder = a.split('|')[0],
                            bOrder = b.split('|')[0],
                            diff = +aOrder - +bOrder;
                        return diff ? diff : d3.ascending(a, b);
                    })
                    .map(function(visit) {
                        return visit.split('|')[1];
                    });

            //If a visit order is specified, use it and concatenate any unspecified visits at the end.
            if (this.config.time_settings.order) {
                this.config.x.order = this.config.time_settings.order.concat(
                    visitOrder.filter(function(visit) {
                        return _this.config.time_settings.order.indexOf(visit) < 0;
                    })
                );
            } else
                //Otherwise use data-driven visit order.
                this.config.x.order = visitOrder;
        } else
            //Otherwise sort a unique set of visits alphanumerically.
            this.config.x.order = d3
                .set(
                    this.raw_data.map(function(d) {
                        return d[_this.config.time_settings.value_col];
                    })
                )
                .values()
                .sort();
    }

    function onInit() {
        var _this = this;

        var config = this.config;

        //'All'variable for non-grouped comparisons
        this.raw_data.forEach(function(d) {
            d.NONE = 'All Participants';
        });

        //Drop missing values
        this.populationCount = d3
            .set(
                this.raw_data.map(function(d) {
                    return d[config.id_col];
                })
            )
            .values().length;
        this.raw_data = this.raw_data.filter(function(f) {
            return config.missingValues.indexOf(f[config.value_col]) === -1;
        });

        //Remove measures with any non-numeric results.
        var allMeasures = d3
                .set(
                    this.raw_data.map(function(m) {
                        return m[config.measure_col];
                    })
                )
                .values(),
            catMeasures = allMeasures.filter(function(measure) {
                var allObservations = _this.raw_data
                        .filter(function(d) {
                            return d[config.measure_col] === measure;
                        })
                        .map(function(d) {
                            return d[config.value_col];
                        }),
                    numericObservations = allObservations.filter(function(d) {
                        return /^-?[0-9.]+$/.test(d);
                    });

                return numericObservations.length < allObservations.length;
            }),
            conMeasures = allMeasures.filter(function(measure) {
                return catMeasures.indexOf(measure) === -1;
            });

        if (catMeasures.length)
            console.warn(
                catMeasures.length +
                    ' non-numeric endpoint' +
                    (catMeasures.length > 1 ? 's have' : ' has') +
                    ' been removed: ' +
                    catMeasures.join(', ')
            );

        this.raw_data = this.raw_data.filter(function(d) {
            return catMeasures.indexOf(d[config.measure_col]) === -1;
        });

        //Define visit order with visit order variable.
        defineVisitOrder.call(this);

        // Remove filters for variables with 0 or 1 levels
        var chart = this;

        this.controls.config.inputs = this.controls.config.inputs.filter(function(d) {
            if (d.type != 'subsetter') {
                return true;
            } else {
                var levels = d3
                    .set(
                        chart.raw_data.map(function(f) {
                            return f[d.value_col];
                        })
                    )
                    .values();
                if (levels.length < 2) {
                    console.warn(
                        d.value_col + ' filter not shown since the variable has less than 2 levels'
                    );
                }
                return levels.length >= 2;
            }
        });

        //Choose the start value for the Test filter
        this.controls.config.inputs.filter(function(input) {
            return input.label === 'Measure';
        })[0].start =
            this.config.start_value || conMeasures[0];
    }

    function addResetButton() {
        var context = this,
            resetContainer = this.controls.wrap
                .insert('div', '#lower-limit')
                .classed('control-group y-axis', true)
                .datum({
                    type: 'button',
                    option: 'y.domain',
                    label: 'Y-axis:'
                }),
            resetLabel = resetContainer
                .append('span')
                .attr('class', 'control-label')
                .style('text-align', 'right')
                .text('Y-axis:'),
            resetButton = resetContainer
                .append('button')
                .text('Reset Limits')
                .on('click', function() {
                    var measure_data = context.raw_data.filter(function(d) {
                        return d[context.config.measure_col] === context.currentMeasure;
                    });
                    context.config.y.domain = d3.extent(measure_data, function(d) {
                        return +d[context.config.value_col];
                    }); //reset axis to full range

                    context.controls.wrap
                        .selectAll('.control-group')
                        .filter(function(f) {
                            return f.option === 'y.domain[0]';
                        })
                        .select('input')
                        .property('value', context.config.y.domain[0]);

                    context.controls.wrap
                        .selectAll('.control-group')
                        .filter(function(f) {
                            return f.option === 'y.domain[1]';
                        })
                        .select('input')
                        .property('value', context.config.y.domain[1]);

                    context.draw();
                });
    }

    function onLayout() {
        //Add population count container.
        this.controls.wrap
            .append('div')
            .attr('id', 'populationCount')
            .style('font-style', 'italic');

        //Distinguish controls to insert y-axis reset button in the correct position.
        this.controls.wrap.selectAll('.control-group').attr('id', function(d) {
            return d.label.toLowerCase().replace(' ', '-');
        });

        //Add a button to reset the y-domain
        addResetButton.call(this);

        //Add y-axis class to y-axis limit controls.
        this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return ['Lower Limit', 'Upper Limit'].indexOf(d.label) > -1;
            })
            .classed('y-axis', true);
    }

    function onPreprocess() {
        var _this = this;

        //Capture currently selected measure.
        var measure = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return d.value_col && d.value_col === _this.config.measure_col;
            })
            .select('option:checked')
            .text();

        //Filter data and nest data by visit and group.
        this.measure_data = this.raw_data.filter(function(d) {
            return d[_this.config.measure_col] === measure;
        });
        var nested_data = d3
            .nest()
            .key(function(d) {
                return d[_this.config.x.column];
            })
            .key(function(d) {
                return d[_this.config.color_by];
            })
            .rollup(function(d) {
                return d.map(function(m) {
                    return +m[_this.config.y.column];
                });
            })
            .entries(this.measure_data);

        //Define y-axis range based on currently selected measure.
        if (!this.config.violins) {
            var y_05s = [];
            var y_95s = [];
            nested_data.forEach(function(visit) {
                visit.values.forEach(function(group) {
                    var results = group.values.sort(d3.ascending);
                    y_05s.push(d3.quantile(results, 0.05));
                    y_95s.push(d3.quantile(results, 0.95));
                });
            });
            this.config.y.domain = [Math.min.apply(null, y_05s), Math.max.apply(null, y_95s)];
        } else
            this.config.y.domain = d3.extent(
                this.measure_data.map(function(d) {
                    return +d[_this.config.y.column];
                })
            );

        //Check if the selected measure has changed.
        var prevMeasure = this.currentMeasure;
        this.currentMeasure = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return d.value_col && d.value_col === _this.config.measure_col;
            })
            .select('option:checked')
            .text();
        var changedMeasureFlag = this.currentMeasure !== prevMeasure;

        //Set y-axis domain.
        if (changedMeasureFlag) {
            //reset axis to full range when measure changes
            this.config.y.domain = d3.extent(this.measure_data, function(d) {
                return +d[_this.config.value_col];
            });
            this.controls.wrap
                .selectAll('.y-axis')
                .property(
                    'title',
                    'Initial Limits: [' +
                        this.config.y.domain[0] +
                        ' - ' +
                        this.config.y.domain[1] +
                        ']'
                );

            //Set y-axis domain controls.
            this.controls.wrap
                .selectAll('.control-group')
                .filter(function(f) {
                    return f.option === 'y.domain[0]';
                })
                .select('input')
                .property('value', this.config.y.domain[0]);
            this.controls.wrap
                .selectAll('.control-group')
                .filter(function(f) {
                    return f.option === 'y.domain[1]';
                })
                .select('input')
                .property('value', this.config.y.domain[1]);
        }
    }

    function onDataTransform() {
        //Redefine y-axis label.
        this.config.y.label =
            this.measure_data[0][this.config.measure_col] +
            ' (' +
            this.measure_data[0][this.config.unit_col] +
            ')';

        //Redefine legend label.
        var group_value_cols = this.config.groups.map(function(group) {
            return group.value_col ? group.value_col : group;
        });
        var group_labels = this.config.groups.map(function(group) {
            return group.label ? group.label : group.value_col ? group.value_col : group;
        });
        var group = this.config.color_by;

        if (group !== 'NONE')
            this.config.legend.label = group_labels[group_value_cols.indexOf(group)];
        else this.config.legend.label = '';
    }

    // Takes a webcharts object creates a text annotation giving the
    // number and percentage of observations shown in the current view
    //
    // inputs:
    // - chart - a webcharts chart object
    // - selector - css selector for the annotation
    // - id_unit - a text string to label the units in the annotation (default = "participants")
    function updateParticipantCount(chart, selector, id_unit) {
        //count the number of unique ids in the current chart and calculate the percentage
        var currentObs = d3
            .set(
                chart.filtered_data.map(function(d) {
                    return d[chart.config.id_col];
                })
            )
            .values().length;
        var percentage = d3.format('0.1%')(currentObs / chart.populationCount);

        //clear the annotation
        var annotation = d3.select(selector);
        d3
            .select(selector)
            .selectAll('*')
            .remove();

        //update the annotation
        var units = id_unit ? ' ' + id_unit : ' participant(s)';
        annotation.text(
            '\n' +
                currentObs +
                ' of ' +
                chart.populationCount +
                units +
                ' shown (' +
                percentage +
                ')'
        );
    }

    function updateYdomain() {
        var yMinSelect = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(f) {
                return f.option === 'y.domain[0]';
            })
            .select('input');

        var yMaxSelect = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(f) {
                return f.option === 'y.domain[1]';
            })
            .select('input');

        //switch the values if min > max
        var range = [yMinSelect.node().value, yMaxSelect.node().value].sort(function(a, b) {
            return a - b;
        });
        yMinSelect.node().value = range[0];
        yMaxSelect.node().value = range[1];

        //apply custom domain to the this
        this.config.y.domain = range;
        this.y_dom = range;
    }

    function onDraw() {
        var _this = this;

        //Annotate population count.
        updateParticipantCount(this, '#populationCount');

        //idk
        this.marks[0].data.forEach(function(d) {
            d.values.sort(function(a, b) {
                return a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : d3.ascending(a.key, b.key);
            });
        });

        //Nest filtered data.
        this.nested_data = d3
            .nest()
            .key(function(d) {
                return d[_this.config.x.column];
            })
            .key(function(d) {
                return d[_this.config.color_by];
            })
            .rollup(function(d) {
                return d.map(function(m) {
                    return +m[_this.config.y.column];
                });
            })
            .entries(this.filtered_data);

        //Clear y-axis ticks.
        this.svg.selectAll('.y .tick').remove();

        //Make nested data set for boxplots
        this.nested_data = d3
            .nest()
            .key(function(d) {
                return d[_this.config.x.column];
            })
            .key(function(d) {
                return d[_this.config.marks[0].per[0]];
            })
            .rollup(function(d) {
                return d.map(function(m) {
                    return +m[_this.config.y.column];
                });
            })
            .entries(this.filtered_data);

        //hack to avoid domains with 0 extent
        if (this.y_dom[0] == this.y_dom[1]) {
            var jitter = this.y_dom[0] / 10;
            this.y_dom[0] = this.y_dom[0] - jitter;
            this.y_dom[1] = this.y_dom[1] + jitter;
        }

        //update the y domain using the custom controsl
        updateYdomain.call(this);
    }

    function addBoxPlot(chart, group) {
        var boxInsideColor =
            arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#eee';
        var precision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        //Make the numericResults numeric and sort.
        var numericResults = group.results
            .map(function(d) {
                return +d;
            })
            .sort(d3.ascending);
        var boxPlotWidth = 0.75 / chart.colorScale.domain().length;
        var boxColor = chart.colorScale(group.key);

        //Define x - and y - scales.
        var x = d3.scale.linear().range([0, chart.x.rangeBand()]);
        var y =
            chart.config.y.type === 'linear'
                ? d3.scale
                      .linear()
                      .range([chart.plot_height, 0])
                      .domain(chart.y.domain())
                : d3.scale
                      .log()
                      .range([chart.plot_height, 0])
                      .domain(chart.y.domain());

        //Define quantiles of interest.
        var probs = [0.05, 0.25, 0.5, 0.75, 0.95],
            iS = void 0;
        for (var _i = 0; _i < probs.length; _i++) {
            probs[_i] = d3.quantile(numericResults, probs[_i]);
        }

        //Define box plot container.
        var boxplot = group.svg
            .append('g')
            .attr('class', 'boxplot')
            .datum({
                values: numericResults,
                probs: probs
            })
            .attr('clip-path', 'url(#' + chart.id + ')');
        var left = x(0.5 - boxPlotWidth / 2);
        var right = x(0.5 + boxPlotWidth / 2);

        //Draw box.
        boxplot
            .append('rect')
            .attr({
                class: 'boxplot fill',
                x: left,
                width: right - left,
                y: y(probs[3]),
                height: y(probs[1]) - y(probs[3])
            })
            .style('fill', boxColor);

        //Draw horizontal lines at 5th percentile, median, and 95th percentile.
        iS = [0, 2, 4];
        var iSclass = ['', 'median', ''];
        var iSColor = [boxColor, boxInsideColor, boxColor];
        for (var _i2 = 0; _i2 < iS.length; _i2++) {
            boxplot
                .append('line')
                .attr({
                    class: 'boxplot ' + iSclass[_i2],
                    x1: left,
                    x2: right,
                    y1: y(probs[iS[_i2]]),
                    y2: y(probs[iS[_i2]])
                })
                .style({
                    fill: iSColor[_i2],
                    stroke: iSColor[_i2]
                });
        }

        //Draw vertical lines from the 5th percentile to the 25th percentile and from the 75th percentile to the 95th percentile.
        iS = [[0, 1], [3, 4]];
        for (var i = 0; i < iS.length; i++) {
            boxplot
                .append('line')
                .attr({
                    class: 'boxplot',
                    x1: x(0.5),
                    x2: x(0.5),
                    y1: y(probs[iS[i][0]]),
                    y2: y(probs[iS[i][1]])
                })
                .style('stroke', boxColor);
        }
        //Draw outer circle.
        boxplot
            .append('circle')
            .attr({
                class: 'boxplot mean',
                cx: x(0.5),
                cy: y(d3.mean(numericResults)),
                r: Math.min(x(boxPlotWidth / 3), 10)
            })
            .style({
                fill: boxInsideColor,
                stroke: boxColor
            });

        //Draw inner circle.
        boxplot
            .append('circle')
            .attr({
                class: 'boxplot mean',
                cx: x(0.5),
                cy: y(d3.mean(numericResults)),
                r: Math.min(x(boxPlotWidth / 6), 5)
            })
            .style({
                fill: boxColor,
                stroke: 'none'
            });

        //Annotate statistics.
        var format0 = d3.format('.' + (precision + 0) + 'f');
        var format1 = d3.format('.' + (precision + 1) + 'f');
        var format2 = d3.format('.' + (precision + 2) + 'f');
        boxplot
            .selectAll('.boxplot')
            .append('title')
            .text(function(d) {
                return (
                    'N = ' +
                    d.values.length +
                    '\nMin = ' +
                    d3.min(d.values) +
                    '\n5th % = ' +
                    format1(d3.quantile(d.values, 0.05)) +
                    '\nQ1 = ' +
                    format1(d3.quantile(d.values, 0.25)) +
                    '\nMedian = ' +
                    format1(d3.median(d.values)) +
                    '\nQ3 = ' +
                    format1(d3.quantile(d.values, 0.75)) +
                    '\n95th % = ' +
                    format1(d3.quantile(d.values, 0.95)) +
                    '\nMax = ' +
                    d3.max(d.values) +
                    '\nMean = ' +
                    format1(d3.mean(d.values)) +
                    '\nStDev = ' +
                    format2(d3.deviation(d.values))
                );
            });
    }

    function addViolinPlot(chart, group) {
        var violinColor =
            arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#ccc7d6';
        var precision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        //Define histogram data.
        var histogram = d3.layout
            .histogram()
            .bins(10)
            .frequency(0);
        var data = histogram(group.results);
        data.unshift({
            x: d3.min(group.results),
            dx: 0,
            y: data[0].y
        });
        data.push({
            x: d3.max(group.results),
            dx: 0,
            y: data[data.length - 1].y
        });

        //Define plot properties.
        var width = chart.x.rangeBand();
        var x =
            chart.config.y.type === 'linear'
                ? d3.scale
                      .linear()
                      .domain(chart.y.domain())
                      .range([chart.plot_height, 0])
                : d3.scale
                      .log()
                      .domain(chart.y.domain())
                      .range([chart.plot_height, 0]);
        var y = d3.scale
            .linear()
            .domain([
                0,
                Math.max(
                    1 - 1 / group.x.nGroups,
                    d3.max(data, function(d) {
                        return d.y;
                    })
                )
            ])
            .range([width / 2, 0]);

        //Define violin shapes.
        var area = d3.svg
            .area()
            .interpolate('basis')
            .x(function(d) {
                return x(d.x + d.dx / 2);
            })
            .y0(width / 2)
            .y1(function(d) {
                return y(d.y);
            });
        var line = d3.svg
            .line()
            .interpolate('basis')
            .x(function(d) {
                return x(d.x + d.dx / 2);
            })
            .y(function(d) {
                return y(d.y);
            });
        var violinplot = group.svg
            .append('g')
            .attr('class', 'violinplot')
            .attr('clip-path', 'url(#' + chart.id + ')');

        //Define left half of violin plot.
        var gMinus = violinplot.append('g').attr('transform', 'rotate(90,0,0) scale(1,-1)');
        gMinus
            .append('path')
            .datum(data)
            .attr({
                class: 'area',
                d: area,
                fill: violinColor,
                'fill-opacity': 0.75
            });
        gMinus
            .append('path')
            .datum(data)
            .attr({
                class: 'violin',
                d: line,
                stroke: violinColor,
                fill: 'none'
            });

        //Define right half of violin plot.
        var gPlus = violinplot
            .append('g')
            .attr('transform', 'rotate(90,0,0) translate(0,-' + width + ')');
        gPlus
            .append('path')
            .datum(data)
            .attr({
                class: 'area',
                d: area,
                fill: violinColor,
                'fill-opacity': 0.75
            });
        gPlus
            .append('path')
            .datum(data)
            .attr({
                class: 'violin',
                d: line,
                stroke: violinColor,
                fill: 'none'
            });

        //Annotate statistics.
        var format0 = d3.format('.' + (precision + 0) + 'f');
        var format1 = d3.format('.' + (precision + 1) + 'f');
        var format2 = d3.format('.' + (precision + 2) + 'f');
        group.svg
            .selectAll('g')
            .append('title')
            .text(function(d) {
                return (
                    'N = ' +
                    group.results.length +
                    '\nMin = ' +
                    d3.min(group.results) +
                    '\n5th % = ' +
                    format1(d3.quantile(group.results, 0.05)) +
                    '\nQ1 = ' +
                    format1(d3.quantile(group.results, 0.25)) +
                    '\nMedian = ' +
                    format1(d3.median(group.results)) +
                    '\nQ3 = ' +
                    format1(d3.quantile(group.results, 0.75)) +
                    '\n95th % = ' +
                    format1(d3.quantile(group.results, 0.95)) +
                    '\nMax = ' +
                    d3.max(group.results) +
                    '\nMean = ' +
                    format1(d3.mean(group.results)) +
                    '\nStDev = ' +
                    format2(d3.deviation(group.results))
                );
            });
    }

    function onResize() {
        var _this = this;

        var config = this.config;

        //Remove legend when chart is ungrouped.
        if (this.config.color_by === 'NONE') this.wrap.select('.legend').remove();

        //Hide Group control if only one grouping is specified.
        var groupControl = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(controlGroup) {
                return controlGroup.label === 'Group';
            });
        groupControl.style('display', function(d) {
            return d.values.length === 1 ? 'none' : groupControl.style('display');
        });

        //Manually draw y-axis ticks when none exist.
        if (!this.svg.selectAll('.y .tick')[0].length) {
            var probs = [
                { probability: 0.05 },
                { probability: 0.25 },
                { probability: 0.5 },
                { probability: 0.75 },
                { probability: 0.95 }
            ];

            for (var i = 0; i < probs.length; i++) {
                probs[i].quantile = d3.quantile(
                    this.measure_data
                        .map(function(d) {
                            return +d[_this.config.y.column];
                        })
                        .sort(),
                    probs[i].probability
                );
            }

            var ticks = [probs[1].quantile, probs[3].quantile];
            this.yAxis.tickValues(ticks);
            this.svg
                .select('g.y.axis')
                .transition()
                .call(this.yAxis);
            this.drawGridlines();
        }

        //Rotate x-axis tick labels.
        if (config.time_settings.rotate_tick_labels)
            this.svg
                .selectAll('.x.axis .tick text')
                .attr({
                    transform: 'rotate(-45)',
                    dx: -10,
                    dy: 10
                })
                .style('text-anchor', 'end');

        //Draw reference boxplot.
        this.svg.selectAll('.boxplot-wrap').remove();

        this.nested_data.forEach(function(e) {
            //Sort [ config.color_by ] groups.
            e.values = e.values.sort(function(a, b) {
                return _this.colorScale.domain().indexOf(a.key) <
                    _this.colorScale.domain().indexOf(b.key)
                    ? -1
                    : 1;
            });

            //Define group object.
            var group = {};
            group.x = {
                key: e.key, // x-axis value
                nGroups: _this.colorScale.domain().length, // number of groups at x-axis value
                width: _this.x.rangeBand() // width of x-axis value
            };
            //Given an odd number of groups, center first box and offset the rest.
            //Given an even number of groups, offset all boxes.
            group.x.start = group.x.nGroups % 2 ? 0 : 1;

            e.values.forEach(function(v, i) {
                group.key = v.key;
                //Calculate direction in which to offset each box plot.
                group.direction =
                    i > 0 ? Math.pow(-1, i % 2) * (group.x.start ? 1 : -1) : group.x.start;
                //Calculate multiplier of offset distance.
                group.multiplier = Math.round((i + group.x.start) / 2);
                //Calculate offset distance as a function of the x-axis range band, number of groups, and whether
                //the number of groups is even or odd.
                group.distance = group.x.width / group.x.nGroups;
                group.distanceOffset =
                    group.x.start * -1 * group.direction * group.x.width / group.x.nGroups / 2;
                //Calculate offset.
                group.offset =
                    group.direction * group.multiplier * group.distance + group.distanceOffset;
                //Capture all results within visit and group.
                group.results = v.values.sort(d3.ascending).map(function(d) {
                    return +d;
                });

                if (_this.x_dom.indexOf(group.x.key) > -1) {
                    group.svg = _this.svg
                        .append('g')
                        .attr({
                            class: 'boxplot-wrap overlay-item',
                            transform: 'translate(' + (_this.x(group.x.key) + group.offset) + ',0)'
                        })
                        .datum({ values: group.results });

                    if (config.boxplots) addBoxPlot(_this, group);

                    if (config.violins) addViolinPlot(_this, group, _this.colorScale(group.key));
                }
            });
        });
    }

    function safetyResultsOverTime(element, settings) {
        var mergedSettings = Object.assign({}, defaultSettings, settings),
            //Merge user settings onto default settings.
            syncedSettings = syncSettings(mergedSettings),
            //Sync properties within merged settings, e.g. data mappings.
            syncedControlInputs = syncControlInputs(controlInputs, syncedSettings),
            //Sync merged settings with controls.
            controls = webcharts.createControls(element, {
                location: 'top',
                inputs: syncedControlInputs
            }),
            //Define controls.
            chart = webcharts.createChart(element, mergedSettings, controls); //Define chart.

        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('preprocess', onPreprocess);
        chart.on('datatransform', onDataTransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        return chart;
    }

    return safetyResultsOverTime;
});
