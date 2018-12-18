(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('webcharts')) :
    typeof define === 'function' && define.amd ? define(['d3', 'webcharts'], factory) :
    (global.safetyResultsOverTime = factory(global.d3,global.webCharts));
}(this, (function (d3,webcharts) { 'use strict';

    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, 'assign', {
            value: function assign(target, varArgs) {

                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }

    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, 'length')).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        return Object(val);
    }

    function isObj(x) {
        var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
        return x !== null && (type === 'object' || type === 'function');
    }

    function assignKey(to, from, key) {
        var val = from[key];

        if (val === undefined) {
            return;
        }

        if (hasOwnProperty.call(to, key)) {
            if (to[key] === undefined) {
                throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
            }
        }

        if (!hasOwnProperty.call(to, key) || !isObj(val)) to[key] = val;else if (val instanceof Array) to[key] = from[key]; // figure out how to merge arrays without converting them into objects
        else to[key] = assign(Object(to[key]), from[key]);
    }

    function assign(to, from) {
        if (to === from) {
            return to;
        }

        from = Object(from);

        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                assignKey(to, from, key);
            }
        }

        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(from);

            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    assignKey(to, from, symbols[i]);
                }
            }
        }

        return to;
    }

    function merge(target) {
        target = toObject(target);

        for (var s = 1; s < arguments.length; s++) {
            assign(target, arguments[s]);
        }

        return target;
    }

    var rendererSpecificSettings = {
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
        visits_without_data: false,
        unscheduled_visits: false,
        unscheduled_visit_pattern: '/unscheduled|early termination/i',
        unscheduled_visit_values: null // takes precedence over unscheduled_visit_pattern
    };

    var webchartsSettings = {
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
                display: 'none'
            }
        }],
        legend: {
            mark: 'square'
        },
        color_by: null, // set in syncSettings()
        resizable: true,
        gridlines: 'y',
        aspect: 3
    };

    var defaultSettings = Object.assign({}, rendererSpecificSettings, webchartsSettings);

    // Replicate settings in multiple places in the settings object
    function syncSettings(settings) {
        settings.x.column = settings.time_settings.value_col;
        settings.x.label = settings.time_settings.label;
        settings.x.behavior = settings.visits_without_data ? 'raw' : 'flex';
        settings.y.column = settings.value_col;
        if (!(settings.groups instanceof Array && settings.groups.length)) settings.groups = [{ value_col: 'NONE', label: 'None' }];else settings.groups = settings.groups.map(function (group) {
            return {
                value_col: group.value_col || group,
                label: group.label || group.value_col || group
            };
        });
        settings.color_by = settings.groups[0].value_col ? settings.groups[0].value_col : settings.groups[0];
        settings.marks[0].per = [settings.color_by];
        settings.margin = settings.margin || { bottom: settings.time_settings.vertical_space };

        //Convert unscheduled_visit_pattern from string to regular expression.
        if (typeof settings.unscheduled_visit_pattern === 'string' && settings.unscheduled_visit_pattern !== '') {
            var flags = settings.unscheduled_visit_pattern.replace(/.*?\/([gimy]*)$/, '$1'),
                pattern = settings.unscheduled_visit_pattern.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
            settings.unscheduled_visit_regex = new RegExp(pattern, flags);
        }

        return settings;
    }

    // Default Control objects
    var controlInputs = [{
        type: 'subsetter',
        label: 'Measure',
        description: 'filter',
        value_col: null, // set in syncControlInputs()
        start: null // set in syncControlInputs()
    }, {
        type: 'dropdown',
        label: 'Group',
        description: 'stratification',
        options: ['marks.0.per.0', 'color_by'],
        start: null, // set in syncControlInputs()
        values: ['NONE'], // set in syncControlInputs()
        require: true
    }, { type: 'number', label: 'Lower Limit', option: 'y.domain[0]', require: true }, { type: 'number', label: 'Upper Limit', option: 'y.domain[1]', require: true }, { type: 'checkbox', inline: true, option: 'visits_without_data', label: 'Visits without data' }, { type: 'checkbox', inline: true, option: 'unscheduled_visits', label: 'Unscheduled visits' }, { type: 'checkbox', inline: true, option: 'boxplots', label: 'Box plots' }, { type: 'checkbox', inline: true, option: 'violins', label: 'Violin plots' }];

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
        settings.groups.filter(function (group) {
            return group.value_col !== 'NONE';
        }).forEach(function (group) {
            groupControl.values.push(group.value_col);
        });

        //Add custom filters to control inputs.
        if (settings.filters) {
            settings.filters.reverse().forEach(function (filter) {
                var thisFilter = {
                    type: 'subsetter',
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter,
                    description: 'filter'
                };

                //add the filter to the control inputs (as long as it's not already there)
                var current_value_cols = controlInputs.filter(function (f) {
                    return f.type == 'subsetter';
                }).map(function (m) {
                    return m.value_col;
                });
                if (current_value_cols.indexOf(thisFilter.value_col) == -1) controlInputs.splice(1, 0, thisFilter);
            });
        }

        //Remove unscheduled visit control if unscheduled visit pattern is unscpecified.
        if (!settings.unscheduled_visit_regex) controlInputs.splice(controlInputs.map(function (controlInput) {
            return controlInput.label;
        }).indexOf('Unscheduled visits'), 1);

        return controlInputs;
    }

    function countParticipants() {
        var _this = this;

        this.populationCount = d3.set(this.raw_data.map(function (d) {
            return d[_this.config.id_col];
        })).values().length;
    }

    function cleanData() {
        var _this = this;

        //Remove missing and non-numeric data.
        var preclean = this.raw_data,
            clean = this.raw_data.filter(function (d) {
            return (/^-?[0-9.]+$/.test(d[_this.config.value_col])
            );
        }),
            nPreclean = preclean.length,
            nClean = clean.length,
            nRemoved = nPreclean - nClean;

        //Warn user of removed records.
        if (nRemoved > 0) console.warn(nRemoved + ' missing or non-numeric result' + (nRemoved > 1 ? 's have' : ' has') + ' been removed.');
        this.raw_data = clean;

        //Attach array of continuous measures to chart object.
        this.measures = d3.set(this.raw_data.map(function (d) {
            return d[_this.config.measure_col];
        })).values().sort();
    }

    function addVariables() {
        var _this = this;

        this.raw_data.forEach(function (d) {
            d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
            d.unscheduled = _this.config.unscheduled_visit_values ? _this.config.unscheduled_visit_values.indexOf(d[_this.config.time_settings.value_col]) > -1 : _this.config.unscheduled_visit_regex ? _this.config.unscheduled_visit_regex.test(d[_this.config.time_settings.value_col]) : false;
        });
    }

    function defineVisitOrder() {
        var _this = this;

        var visits = void 0,
            visitOrder = void 0;

        //Given an ordering variable sort a unique set of visits by the ordering variable.
        if (this.config.time_settings.order_col && this.raw_data[0].hasOwnProperty(this.config.time_settings.order_col)) {
            //Define a unique set of visits with visit order concatenated.
            visits = d3.set(this.raw_data.map(function (d) {
                return d[_this.config.time_settings.order_col] + '|' + d[_this.config.time_settings.value_col];
            })).values();

            //Sort visits.
            visitOrder = visits.sort(function (a, b) {
                var aOrder = a.split('|')[0],
                    bOrder = b.split('|')[0],
                    diff = +aOrder - +bOrder;
                return diff ? diff : d3.ascending(a, b);
            }).map(function (visit) {
                return visit.split('|')[1];
            });
        } else {
            //Otherwise sort a unique set of visits alphanumerically.
            //Define a unique set of visits.
            visits = d3.set(this.raw_data.map(function (d) {
                return d[_this.config.time_settings.value_col];
            })).values();

            //Sort visits;
            visitOrder = visits.sort();
        }

        //Set x-axis domain.
        if (this.config.time_settings.order) {
            //If a visit order is specified, use it and concatenate any unspecified visits at the end.
            this.config.x.order = this.config.time_settings.order.concat(visitOrder.filter(function (visit) {
                return _this.config.time_settings.order.indexOf(visit) < 0;
            }));
        } else
            //Otherwise use data-driven visit order.
            this.config.x.order = visitOrder;
    }

    function checkFilters() {
        var _this = this;

        this.controls.config.inputs = this.controls.config.inputs.filter(function (input) {
            if (input.type != 'subsetter') {
                return true;
            } else if (!_this.raw_data[0].hasOwnProperty(input.value_col)) {
                console.warn('The [ ' + input.label + ' ] filter has been removed because the variable does not exist.');
            } else {
                var levels = d3.set(_this.raw_data.map(function (d) {
                    return d[input.value_col];
                })).values();

                if (levels.length === 1) console.warn('The [ ' + input.label + ' ] filter has been removed because the variable has only one level.');

                return levels.length > 1;
            }
        });
    }

    function setInitialMeasure() {
        this.controls.config.inputs.filter(function (input) {
            return input.label === 'Measure';
        })[0].start = this.config.start_value || this.measures[0];
    }

    function onInit() {
        // 1. Count total participants prior to data cleaning.
        countParticipants.call(this);

        // 2. Drop missing values and remove measures with any non-numeric results.
        cleanData.call(this);

        // 3a Define additional variables.
        addVariables.call(this);

        // 3b Define ordered x-axis domain with visit order variable.
        defineVisitOrder.call(this);

        // 3c Remove filters for nonexistent or single-level variables.
        checkFilters.call(this);

        // 3d Choose the start value for the Test filter
        setInitialMeasure.call(this);
    }

    function classControlGroups() {
        this.controls.wrap.selectAll('.control-group').each(function (d) {
            var controlGroup = d3.select(this);
            controlGroup.classed(d.label.toLowerCase().replace(' ', '-'), true);
            if (['Lower Limit', 'Upper Limit'].indexOf(d.label) > -1) controlGroup.classed('y-axis', true);
        });
    }

    function removeGroupControl() {
        var groupControl = this.controls.wrap.selectAll('.control-group').filter(function (controlGroup) {
            return controlGroup.label === 'Group';
        });
        groupControl.style('display', function (d) {
            return d.values.length === 1 ? 'none' : groupControl.style('display');
        });
    }

    function addResetButton() {
        var context = this,
            resetContainer = this.controls.wrap.insert('div', '#lower-limit').classed('control-group y-axis', true).datum({
            type: 'button',
            option: 'y.domain',
            label: 'Y-axis:'
        }),
            resetLabel = resetContainer.append('span').attr('class', 'wc-control-label').style('text-align', 'right').text('Y-axis:'),
            resetButton = resetContainer.append('button').text('Reset Limits').on('click', function () {
            var measure_data = context.raw_data.filter(function (d) {
                return d[context.config.measure_col] === context.currentMeasure;
            });
            context.config.y.domain = d3.extent(measure_data, function (d) {
                return +d[context.config.value_col];
            }); //reset axis to full range

            context.controls.wrap.selectAll('.control-group').filter(function (f) {
                return f.option === 'y.domain[0]';
            }).select('input').property('value', context.config.y.domain[0]);

            context.controls.wrap.selectAll('.control-group').filter(function (f) {
                return f.option === 'y.domain[1]';
            }).select('input').property('value', context.config.y.domain[1]);

            context.draw();
        });
    }

    function addPopulationCountContainer() {
        this.populationCountContainer = this.controls.wrap.append('div').classed('population-count', true).style('font-style', 'italic');
    }

    function onLayout() {
        classControlGroups.call(this);
        removeGroupControl.call(this);
        addResetButton.call(this);
        addPopulationCountContainer.call(this);
    }

    function getCurrentMeasure() {
        var _this = this;

        this.previousMeasure = this.currentMeasure;
        this.currentMeasure = this.controls.wrap.selectAll('.control-group').filter(function (d) {
            return d.value_col && d.value_col === _this.config.measure_col;
        }).select('option:checked').text();
    }

    function defineMeasureData() {
        var _this = this;

        this.measure_data = this.raw_data.filter(function (d) {
            return d[_this.config.measure_col] === _this.currentMeasure;
        });
        this.filtered_measure_data = this.measure_data.filter(function (d) {
            var filtered = false;

            _this.filters.filter(function (filter) {
                return filter.value_col !== _this.config.measure_col;
            }).forEach(function (filter) {
                if (filtered === false && filter.val !== 'All') filtered = filter.val instanceof Array ? filter.val.indexOf(d[filter.col]) < 0 : filter.val !== d[filter.col];
            });

            return !filtered;
        });
        this.nested_measure_data = d3.nest().key(function (d) {
            return d[_this.config.x.column];
        }).key(function (d) {
            return d[_this.config.color_by];
        }).rollup(function (d) {
            return d.map(function (m) {
                return +m[_this.config.y.column];
            });
        }).entries(this.filtered_measure_data);
    }

    function removeVisitsWithoutData() {
        var _this = this;

        if (!this.config.visits_without_data) this.config.x.domain = this.config.x.domain.filter(function (visit) {
            return d3.set(_this.filtered_measure_data.map(function (d) {
                return d[_this.config.time_settings.value_col];
            })).values().indexOf(visit) > -1;
        });
    }

    function removeUnscheduledVisits() {
        var _this = this;

        if (!this.config.unscheduled_visits) {
            if (this.config.unscheduled_visit_values) this.config.x.domain = this.config.x.domain.filter(function (visit) {
                return _this.config.unscheduled_visit_values.indexOf(visit) < 0;
            });else if (this.config.unscheduled_visit_regex) this.config.x.domain = this.config.x.domain.filter(function (visit) {
                return !_this.config.unscheduled_visit_regex.test(visit);
            });
        }
    }

    function setXdomain() {
        this.config.x.domain = this.config.x.order;
        removeVisitsWithoutData.call(this);
        removeUnscheduledVisits.call(this);
    }

    function setYdomain() {
        var _this = this;

        //Define y-domain.
        if (this.currentMeasure !== this.previousMeasure) this.config.y.domain = d3.extent(this.measure_data.map(function (d) {
            return +d[_this.config.y.column];
        }));else if (this.config.y.domain[0] > this.config.y.domain[1])
            // new measure
            this.config.y.domain.reverse();else if (this.config.y.domain[0] === this.config.y.domain[1])
            // invalid domain
            this.config.y.domain = this.config.y.domain.map(function (d, i) {
                return i === 0 ? d - d * 0.01 : d + d * 0.01;
            }); // domain with zero range
    }

    function updateYaxisLimitControls() {
        //Update y-axis limit controls.
        this.controls.wrap.selectAll('.control-group').filter(function (f) {
            return f.option === 'y.domain[0]';
        }).select('input').property('value', this.config.y.domain[0]);
        this.controls.wrap.selectAll('.control-group').filter(function (f) {
            return f.option === 'y.domain[1]';
        }).select('input').property('value', this.config.y.domain[1]);
    }

    function setYaxisLabel() {
        this.config.y.label = this.currentMeasure + (this.config.unit_col && this.measure_data[0][this.config.unit_col] ? ' (' + this.measure_data[0][this.config.unit_col] + ')' : '');
    }

    function setLegendLabel() {
        this.config.legend.label = this.config.color_by !== 'NONE' ? this.config.groups[this.config.groups.map(function (group) {
            return group.value_col;
        }).indexOf(this.config.color_by)].label : '';
    }

    function updateYaxisResetButton() {
        //Update tooltip of y-axis domain reset button.
        if (this.currentMeasure !== this.previousMeasure) this.controls.wrap.selectAll('.y-axis').property('title', 'Initial Limits: [' + this.config.y.domain[0] + ' - ' + this.config.y.domain[1] + ']');
    }

    function onPreprocess() {
        // 1. Capture currently selected measure.
        getCurrentMeasure.call(this);

        // 2. Filter data on currently selected measure.
        defineMeasureData.call(this);

        // 3a Set x-domain given current visit settings.
        setXdomain.call(this);

        // 3b Set y-domain given currently selected measure.
        setYdomain.call(this);

        // 3c Set y-axis label to current measure.
        setYaxisLabel.call(this);

        // 4a Update y-axis reset button when measure changes.
        updateYaxisResetButton.call(this);

        // 4b Update y-axis limit controls to match y-axis domain.
        updateYaxisLimitControls.call(this);

        //Set legend label to current group.
        setLegendLabel.call(this);
    }

    function removeUnscheduledVists() {
        var _this = this;

        if (!this.config.unscheduled_visits) this.current_data.forEach(function (d) {
            d.values = d.values.filter(function (di) {
                return _this.config.x.domain.indexOf(di.key) > -1;
            });
        });
    }

    function onDatatransform() {
        //Remove unscheduled visits from current_data array.
        removeUnscheduledVists.call(this);
    }

    function updateParticipantCount() {
        var _this = this;

        this.populationCountContainer.selectAll('*').remove();
        var subpopulationCount = d3.set(this.filtered_data.map(function (d) {
            return d[_this.config.id_col];
        })).values().length;
        var percentage = d3.format('0.1%')(subpopulationCount / this.populationCount);
        this.populationCountContainer.text('\n' + subpopulationCount + ' of ' + this.populationCount + ' participants  shown (' + percentage + ')');
    }

    function onDraw() {
        updateParticipantCount.call(this);
    }

    function addYAxisTicks() {
        var _this = this;

        //Manually draw y-axis ticks when none exist.
        if (!this.svg.selectAll('.y .tick')[0].length) {
            var probs = [{ probability: 0.05 }, { probability: 0.25 }, { probability: 0.5 }, { probability: 0.75 }, { probability: 0.95 }];

            for (var i = 0; i < probs.length; i++) {
                probs[i].quantile = d3.quantile(this.measure_data.map(function (d) {
                    return +d[_this.config.y.column];
                }).sort(), probs[i].probability);
            }

            var ticks = [probs[1].quantile, probs[3].quantile];
            this.yAxis.tickValues(ticks);
            this.svg.select('g.y.axis').transition().call(this.yAxis);
            this.drawGridlines();
        }
    }

    function clearCanvas() {
        this.svg.selectAll('.boxplot-wrap').remove();
    }

    function addBoxPlot(chart, subgroup) {
        var boxInsideColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#eee';

        //Make the numericResults numeric and sort.
        var numericResults = subgroup.results.map(function (d) {
            return +d;
        }).sort(d3.ascending);
        var boxPlotWidth = 0.75 / chart.colorScale.domain().length;
        var boxColor = chart.colorScale(subgroup.key);

        //Define x - and y - scales.
        var x = d3.scale.linear().range([0, chart.x.rangeBand()]);
        var y = chart.config.y.type === 'linear' ? d3.scale.linear().range([chart.plot_height, 0]).domain(chart.y.domain()) : d3.scale.log().range([chart.plot_height, 0]).domain(chart.y.domain());

        //Define quantiles of interest.
        var probs = [0.05, 0.25, 0.5, 0.75, 0.95],
            iS = void 0;
        for (var _i = 0; _i < probs.length; _i++) {
            probs[_i] = d3.quantile(numericResults, probs[_i]);
        }

        //Define box plot container.
        var boxplot = subgroup.svg.append('g').attr('class', 'boxplot').datum({
            values: numericResults,
            probs: probs
        }).attr('clip-path', 'url(#' + chart.id + ')');
        var left = x(0.5 - boxPlotWidth / 2);
        var right = x(0.5 + boxPlotWidth / 2);

        //Draw box.
        boxplot.append('rect').attr({
            class: 'boxplot fill',
            x: left,
            width: right - left,
            y: y(probs[3]),
            height: y(probs[1]) - y(probs[3])
        }).style('fill', boxColor);

        //Draw horizontal lines at 5th percentile, median, and 95th percentile.
        iS = [0, 2, 4];
        var iSclass = ['', 'median', ''];
        var iSColor = [boxColor, boxInsideColor, boxColor];
        for (var _i2 = 0; _i2 < iS.length; _i2++) {
            boxplot.append('line').attr({
                class: 'boxplot ' + iSclass[_i2],
                x1: left,
                x2: right,
                y1: y(probs[iS[_i2]]),
                y2: y(probs[iS[_i2]])
            }).style({
                fill: iSColor[_i2],
                stroke: iSColor[_i2]
            });
        }

        //Draw vertical lines from the 5th percentile to the 25th percentile and from the 75th percentile to the 95th percentile.
        iS = [[0, 1], [3, 4]];
        for (var i = 0; i < iS.length; i++) {
            boxplot.append('line').attr({
                class: 'boxplot',
                x1: x(0.5),
                x2: x(0.5),
                y1: y(probs[iS[i][0]]),
                y2: y(probs[iS[i][1]])
            }).style('stroke', boxColor);
        }
        //Draw outer circle.
        boxplot.append('circle').attr({
            class: 'boxplot mean',
            cx: x(0.5),
            cy: y(d3.mean(numericResults)),
            r: Math.min(x(boxPlotWidth / 3), 10)
        }).style({
            fill: boxInsideColor,
            stroke: boxColor
        });

        //Draw inner circle.
        boxplot.append('circle').attr({
            class: 'boxplot mean',
            cx: x(0.5),
            cy: y(d3.mean(numericResults)),
            r: Math.min(x(boxPlotWidth / 6), 5)
        }).style({
            fill: boxColor,
            stroke: 'none'
        });
    }

    function addViolinPlot(chart, subgroup) {
        var violinColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#ccc7d6';

        //Define histogram data.
        var histogram = d3.layout.histogram().bins(10).frequency(0);
        var data = histogram(subgroup.results);
        data.unshift({
            x: d3.min(subgroup.results),
            dx: 0,
            y: data[0].y
        });
        data.push({
            x: d3.max(subgroup.results),
            dx: 0,
            y: data[data.length - 1].y
        });

        //Define plot properties.
        var width = chart.x.rangeBand();
        var x = chart.config.y.type === 'linear' ? d3.scale.linear().domain(chart.y.domain()).range([chart.plot_height, 0]) : d3.scale.log().domain(chart.y.domain()).range([chart.plot_height, 0]);
        var y = d3.scale.linear().domain([0, Math.max(1 - 1 / subgroup.group.x.nGroups, d3.max(data, function (d) {
            return d.y;
        }))]).range([width / 2, 0]);

        //Define violin shapes.
        var area = d3.svg.area().interpolate('basis').x(function (d) {
            return x(d.x + d.dx / 2);
        }).y0(width / 2).y1(function (d) {
            return y(d.y);
        });
        var line = d3.svg.line().interpolate('basis').x(function (d) {
            return x(d.x + d.dx / 2);
        }).y(function (d) {
            return y(d.y);
        });
        var violinplot = subgroup.svg.append('g').attr('class', 'violinplot').attr('clip-path', 'url(#' + chart.id + ')');

        //Define left half of violin plot.
        var gMinus = violinplot.append('g').attr('transform', 'rotate(90,0,0) scale(1,-1)');
        gMinus.append('path').datum(data).attr({
            class: 'area',
            d: area,
            fill: violinColor,
            'fill-opacity': 0.75
        });
        gMinus.append('path').datum(data).attr({
            class: 'violin',
            d: line,
            stroke: violinColor,
            fill: 'none'
        });

        //Define right half of violin plot.
        var gPlus = violinplot.append('g').attr('transform', 'rotate(90,0,0) translate(0,-' + width + ')');
        gPlus.append('path').datum(data).attr({
            class: 'area',
            d: area,
            fill: violinColor,
            'fill-opacity': 0.75
        });
        gPlus.append('path').datum(data).attr({
            class: 'violin',
            d: line,
            stroke: violinColor,
            fill: 'none'
        });
    }

    function addSummaryStatistics(subgroup) {
        var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var format0 = d3.format('.' + (precision + 0) + 'f');
        var format1 = d3.format('.' + (precision + 1) + 'f');
        var format2 = d3.format('.' + (precision + 2) + 'f');
        subgroup.svg.selectAll('g').append('title').text(function (d) {
            return 'N = ' + subgroup.results.length + '\nMin = ' + d3.min(subgroup.results) + '\n5th % = ' + format1(d3.quantile(subgroup.results, 0.05)) + '\nQ1 = ' + format1(d3.quantile(subgroup.results, 0.25)) + '\nMedian = ' + format1(d3.median(subgroup.results)) + '\nQ3 = ' + format1(d3.quantile(subgroup.results, 0.75)) + '\n95th % = ' + format1(d3.quantile(subgroup.results, 0.95)) + '\nMax = ' + d3.max(subgroup.results) + '\nMean = ' + format1(d3.mean(subgroup.results)) + '\nStDev = ' + format2(d3.deviation(subgroup.results));
        });

        //Annotate statistics.
        //const format0 = format(`.${precision + 0}f`);
        //const format1 = format(`.${precision + 1}f`);
        //const format2 = format(`.${precision + 2}f`);
        //boxplot
        //    .selectAll('.boxplot')
        //    .append('title')
        //    .text(
        //        d =>
        //            'N = ' +
        //            d.values.length +
        //            '\nMin = ' +
        //            min(d.values) +
        //            '\n5th % = ' +
        //            format1(quantile(d.values, 0.05)) +
        //            '\nQ1 = ' +
        //            format1(quantile(d.values, 0.25)) +
        //            '\nMedian = ' +
        //            format1(median(d.values)) +
        //            '\nQ3 = ' +
        //            format1(quantile(d.values, 0.75)) +
        //            '\n95th % = ' +
        //            format1(quantile(d.values, 0.95)) +
        //            '\nMax = ' +
        //            max(d.values) +
        //            '\nMean = ' +
        //            format1(mean(d.values)) +
        //            '\nStDev = ' +
        //            format2(deviation(d.values))
        //    );
    }

    function drawPlots() {
        var _this = this;

        this.nested_measure_data.filter(function (d) {
            return _this.x_dom.indexOf(d.key) > -1;
        }).forEach(function (d) {
            //Sort [ config.color_by ] groups.
            d.values = d.values.sort(function (a, b) {
                return _this.colorScale.domain().indexOf(a.key) < _this.colorScale.domain().indexOf(b.key) ? -1 : 1;
            });

            //Define group object.
            var group = {
                x: {
                    key: d.key, // x-axis value
                    nGroups: _this.colorScale.domain().length, // number of groups at x-axis value
                    width: _this.x.rangeBand() // width of x-axis value
                },
                subgroups: []
            };
            group.x.start = -(group.x.nGroups / 2) + 0.5;
            group.distance = group.x.width / group.x.nGroups;

            d.values.forEach(function (di, i) {
                var subgroup = {
                    group: group,
                    key: di.key,
                    offset: (group.x.start + i) * group.distance,
                    results: di.values.sort(d3.ascending).map(function (value) {
                        return +value;
                    })
                };
                subgroup.svg = _this.svg.append('g').attr({
                    class: 'boxplot-wrap overlay-item',
                    transform: 'translate(' + (_this.x(group.x.key) + subgroup.offset) + ',0)'
                }).datum({ values: subgroup.results });
                group.subgroups.push(subgroup);

                if (_this.config.boxplots) addBoxPlot(_this, subgroup);
                if (_this.config.violins) addViolinPlot(_this, subgroup, _this.colorScale(subgroup.key));
                addSummaryStatistics(subgroup);
            });
        });
    }

    function rotateXAxisTickLabels() {
        if (this.config.time_settings.rotate_tick_labels) this.svg.selectAll('.x.axis .tick text').attr({
            transform: 'rotate(-45)',
            dx: -10,
            dy: 10
        }).style('text-anchor', 'end');
    }

    function removeLegend() {
        if (this.config.color_by === 'NONE') this.wrap.select('.legend').remove();
    }

    function onResize() {
        addYAxisTicks.call(this);
        clearCanvas.call(this);
        drawPlots.call(this);
        rotateXAxisTickLabels.call(this);
        removeLegend.call(this);
    }

    function safetyResultsOverTime(element, settings) {
        var mergedSettings = merge(defaultSettings, settings),
            //Merge user settings onto default settings.
        syncedSettings = syncSettings(mergedSettings),
            //Sync properties within merged settings, e.g. data mappings.
        syncedControlInputs = syncControlInputs(controlInputs, syncedSettings),
            //Sync merged settings with controls.
        controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs }),
            //Define controls.
        chart = webcharts.createChart(element, mergedSettings, controls); //Define chart.

        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('preprocess', onPreprocess);
        chart.on('datatransform', onDatatransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        return chart;
    }

    return safetyResultsOverTime;

})));
