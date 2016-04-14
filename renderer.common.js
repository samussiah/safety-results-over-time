'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopDefault(ex) {
    return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = _interopDefault(require('react'));
var d3$1 = require('d3');
var webcharts = require('webcharts');

function stringAccessor(o, s, v) {
    //adapted from http://jsfiddle.net/alnitak/hEsys/
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            if (i == n - 1 && v !== undefined) o[k] = v;
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

var binding = {
    dataMappings: [{
        source: "x",
        target: "x.column"
    }, {
        source: "x_order",
        target: "x.order"
    }, {
        source: "x_domain",
        target: "x.domain"
    }, {
        source: "y",
        target: "y.column"
    }, {
        source: "y_order",
        target: "y.order"
    }, {
        source: "y_domain",
        target: "y.domain"
    }, {
        source: "group",
        target: "marks.0.per"
    }, {
        source: "subgroup",
        target: "marks.0.split"
    }, {
        source: "subset",
        target: "marks.0.values"
    }, {
        source: "color_by",
        target: "color_by"
    }, {
        source: "legend_order",
        target: "legend.order"
    }, {
        source: "tooltip",
        target: "marks.0.tooltip"
    }],
    chartProperties: [{
        source: "date_format",
        target: "date_format"
    }, {
        source: "x_label",
        target: "x.label"
    }, {
        source: "x_type",
        target: "x.type"
    }, {
        source: "x_format",
        target: "x.format"
    }, {
        source: "x_sort",
        target: "x.sort"
    }, {
        source: "x_bin",
        target: "x.bin"
    }, {
        source: "x_behavior",
        target: "x.behavior"
    }, {
        source: "y_label",
        target: "y.label"
    }, {
        source: "y_type",
        target: "y.type"
    }, {
        source: "y_format",
        target: "y.format"
    }, {
        source: "y_sort",
        target: "y.sort"
    }, {
        source: "y_behavior",
        target: "y.behavior"
    }, {
        source: "marks_type",
        target: "marks.0.type"
    }, {
        source: "marks_summarizeX",
        target: "marks.0.summarizeX"
    }, {
        source: "marks_summarizeY",
        target: "marks.0.summarizeY"
    }, {
        source: "marks_arrange",
        target: "marks.0.arrange"
    }, {
        source: "marks_fill_opacity",
        target: "marks.0.attributes.fill-opacity"
    }, {
        source: "aspect_ratio",
        target: "aspect"
    }, {
        source: "range_band",
        target: "range_band"
    }, {
        source: "colors",
        target: "colors"
    }, {
        source: "gridlines",
        target: "gridlines"
    }, {
        source: "max_width",
        target: "max_width"
    }, {
        source: "resizable",
        target: "resizable"
    }, {
        source: "scale_text",
        target: "scale_text"
    }, {
        source: "legend_mark",
        target: "legend.mark"
    }, {
        source: "legend_label",
        target: "legend.label"
    }]
};

var settings = {
    //Addition settings for this template
    id_col: "USUBJID",
    time_col: "VISITN",
    measure_col: "TEST",
    value_col: "STRESN",
    unit_col: "STRESU",
    normal_col_low: "STNRLO",
    normal_col_high: "STNRHI",
    start_value: null,
    rotateX: true,
    missingValues: ["NA", ""],
    //Standard webcharts settings
    x: {
        column: "VISITN",
        type: "ordinal",
        label: null,
        sort: "alphabetical-ascending",
        behavior: "flex",
        tickAttr: null
    },
    y: {
        column: "STRESN",
        stat: "mean",
        type: "linear",
        label: "Value",
        behavior: "flex",
        format: "0.2f"
    },
    marks: [{
        type: "line",
        per: ["ALL"],
        attributes: {
            'stroke-width': 2,
            'stroke-opacity': 1,
            "display": "none"
        }
    }],
    legend: {
        label: ''
    },
    color_by: 'ALL',
    resizable: false,
    //  max_width: 600,
    height: 500,
    range_band: 20,
    margin: { bottom: 50 },
    //  aspect: 1.33,
    gridlines: 'xy'
};

var controlInputs = [{
    label: "Measure",
    value_col: "TEST",
    type: "subsetter",
    start: null
}, {
    label: "Group",
    options: ["marks.0.per.0", "color_by"],
    type: "dropdown",
    require: true,
    values: ['ALL', 'SEX', 'RACE'],
    start: "ALL"
}, {
    label: "Hide visits with no data:",
    option: "x.behavior",
    type: "radio",
    require: true,
    values: ['flex', 'raw'],
    relabels: ['Yes', "No"]
}];

function onInit() {
    var _this = this;

    var config = this.config;
    var allMeasures = d3$1.set(this.raw_data.map(function (m) {
        return m[config.measure_col];
    })).values();

    // "All" variable for non-grouped comparisons
    this.raw_data.forEach(function (e) {
        return e.ALL = "All";
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

        return webcharts.dataOps.getValType(measureVals, config.value_col) !== "continuous";
    });
    if (catMeasures.length) {
        console.warn(catMeasures.length + " non-numeric endpoints have been removed: " + catMeasures.join(", "));
    }

    //delete non-numeric endpoints
    var numMeasures = allMeasures.filter(function (f) {
        var measureVals = _this.raw_data.filter(function (d) {
            return d[config.measure_col] === f;
        });

        return webcharts.dataOps.getValType(measureVals, config.value_col) === "continuous";
    });

    this.raw_data = this.raw_data.filter(function (f) {
        return numMeasures.indexOf(f[config.measure_col]) > -1;
    });

    //Choose the start value for the Test filter
    this.controls.config.inputs[0].start = this.config.startValue || numMeasures[0];
};

function onLayout() {}

function onDataTransform() {}

function onDraw() {
    var _this2 = this;

    this.marks[0].data.forEach(function (e) {
        e.values.sort(function (a, b) {
            return a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : d3$1.ascending(a.key, b.key);
        });
    });

    var sortVar = this.config.x.column;

    // Make nested data set for boxplots
    this.nested_data = d3$1.nest().key(function (d) {
        return d[_this2.config.x.column];
    }).key(function (d) {
        return d[_this2.config.marks[0].per[0]];
    }).rollup(function (d) {
        return d.map(function (m) {
            return +m[_this2.config.y.column];
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
}

function addBoxplot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor, format, horizontal) {
    //set default orientation to "horizontal"
    var horizontal = horizontal == undefined ? true : horizontal;

    //make the results numeric and sort
    var results = results.map(function (d) {
        return +d;
    }).sort(d3.ascending);

    //set up scales
    var y = d3.scale.linear().range([height, 0]);

    var x = d3.scale.linear().range([0, width]);

    if (horizontal) {
        y.domain(domain);
    } else {
        x.domain(domain);
    }

    var probs = [0.05, 0.25, 0.5, 0.75, 0.95];
    for (var i = 0; i < probs.length; i++) {
        probs[i] = d3.quantile(results, probs[i]);
    }

    var boxplot = svg.append("g").attr("class", "boxplot").datum({ values: results, probs: probs });

    //set bar width variable
    var left = horizontal ? 0.5 - boxPlotWidth / 2 : null;
    var right = horizontal ? 0.5 + boxPlotWidth / 2 : null;
    var top = horizontal ? null : 0.5 - boxPlotWidth / 2;
    var bottom = horizontal ? null : 0.5 + boxPlotWidth / 2;

    //draw rectangle from q1 to q3
    var box_x = horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[1]);
    var box_width = horizontal ? x(0.5 + boxPlotWidth / 2) - x(0.5 - boxPlotWidth / 2) : x(probs[3]) - x(probs[1]);
    var box_y = horizontal ? y(probs[3]) : y(0.5 + boxPlotWidth / 2);
    var box_height = horizontal ? -y(probs[3]) + y(probs[1]) : y(0.5 - boxPlotWidth / 2) - y(0.5 + boxPlotWidth / 2);

    boxplot.append("rect").attr("class", "boxplot fill").attr("x", box_x).attr("width", box_width).attr("y", box_y).attr("height", box_height).style("fill", boxColor);

    //draw dividing lines at median, 95% and 5%
    var iS = [0, 2, 4];
    var iSclass = ["", "median", ""];
    var iSColor = [boxColor, boxInsideColor, boxColor];
    for (var i = 0; i < iS.length; i++) {
        boxplot.append("line").attr("class", "boxplot " + iSclass[i]).attr("x1", horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[iS[i]])).attr("x2", horizontal ? x(0.5 + boxPlotWidth / 2) : x(probs[iS[i]])).attr("y1", horizontal ? y(probs[iS[i]]) : y(0.5 - boxPlotWidth / 2)).attr("y2", horizontal ? y(probs[iS[i]]) : y(0.5 + boxPlotWidth / 2)).style("fill", iSColor[i]).style("stroke", iSColor[i]);
    }

    //draw lines from 5% to 25% and from 75% to 95%
    var iS = [[0, 1], [3, 4]];
    for (var i = 0; i < iS.length; i++) {
        boxplot.append("line").attr("class", "boxplot").attr("x1", horizontal ? x(0.5) : x(probs[iS[i][0]])).attr("x2", horizontal ? x(0.5) : x(probs[iS[i][1]])).attr("y1", horizontal ? y(probs[iS[i][0]]) : y(0.5)).attr("y2", horizontal ? y(probs[iS[i][1]]) : y(0.5)).style("stroke", boxColor);
    }

    boxplot.append("circle").attr("class", "boxplot mean").attr("cx", horizontal ? x(0.5) : x(d3.mean(results))).attr("cy", horizontal ? y(d3.mean(results)) : y(0.5)).attr("r", horizontal ? x(boxPlotWidth / 3) : y(1 - boxPlotWidth / 3)).style("fill", boxInsideColor).style("stroke", boxColor);

    boxplot.append("circle").attr("class", "boxplot mean").attr("cx", horizontal ? x(0.5) : x(d3.mean(results))).attr("cy", horizontal ? y(d3.mean(results)) : y(0.5)).attr("r", horizontal ? x(boxPlotWidth / 6) : y(1 - boxPlotWidth / 6)).style("fill", boxColor).style("stroke", 'None');

    var formatx = format ? d3.format(format) : d3.format(".2f");

    boxplot.selectAll(".boxplot").append("title").text(function (d) {
        return "N = " + d.values.length + "\n" + "Min = " + d3.min(d.values) + "\n" + "5th % = " + formatx(d3.quantile(d.values, 0.05)) + "\n" + "Q1 = " + formatx(d3.quantile(d.values, 0.25)) + "\n" + "Median = " + formatx(d3.median(d.values)) + "\n" + "Q3 = " + formatx(d3.quantile(d.values, 0.75)) + "\n" + "95th % = " + formatx(d3.quantile(d.values, 0.95)) + "\n" + "Max = " + d3.max(d.values) + "\n" + "Mean = " + formatx(d3.mean(d.values)) + "\n" + "StDev = " + formatx(d3.deviation(d.values));
    });
}

function adjustTicks(axis, dx, dy, rotation, anchor) {
    if (!axis) return;
    this.svg.selectAll("." + axis + ".axis .tick text").attr({
        "transform": "rotate(" + rotation + ")",
        "dx": dx,
        "dy": dy
    }).style("text-anchor", anchor || 'start');
}

function onResize() {
    var _this3 = this;

    var config = this.config;
    var units = this.filtered_data[0][config.unit_col];
    var measure = this.filtered_data[0][config.measure_col];

    this.svg.select(".y.axis").select(".axis-title").text(measure + " level (" + units + ")");

    //draw reference boxplot
    this.svg.selectAll(".boxplot-wrap").remove();

    this.nested_data.forEach(function (e) {
        e.values.forEach(function (v, i) {
            var index = _this3.colorScale.domain().indexOf(v.key);
            var sign = index % 2 === 0 ? -1 : 1;
            var multiplier = index === 1 ? 1 : Math.floor(index / 2);
            var offset = sign * multiplier * _this3.colorScale.domain().length * 4;
            var results = v.values.sort(d3$1.ascending).map(function (d) {
                return +d;
            });
            if (_this3.x_dom.indexOf(e.key) > -1) {
                var g = _this3.svg.append("g").attr("class", "boxplot-wrap overlay-item").attr("transform", "translate(" + (_this3.x(e.key) + offset) + ",0)").datum({ values: results });

                var boxPlotWidth = _this3.colorScale.domain().length === 1 ? 1 : _this3.colorScale.domain().length === 2 ? 0.33 : 0.25;

                addBoxplot(g, //svg
                results, //results
                _this3.plot_height, //height
                _this3.x.rangeBand(), //width
                _this3.y.domain(), //domain
                boxPlotWidth, //boxPlotWidth
                _this3.colorScale(v.key), //boxColor
                "#eee" //boxInsideColor
                );
            }
        });
    });

    // rotate ticks
    if (config.x.tickAttr) {
        adjustTicks.call(this, 'x', 0, 0, config.x.tickAttr.rotate, config.x.tickAttr.anchor);
    }
}

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

function outlierExplorer(element, settings$$) {
    //merge user's settings with defaults
    var mergedSettings = Object.assign({}, settings, settings$$);
    // nested objects must be copied explicitly
    mergedSettings.x = Object.assign({}, settings.x, settings$$.x);
    mergedSettings.y = Object.assign({}, settings.y, settings$$.y);
    mergedSettings.margin = Object.assign({}, settings.margin, settings$$.margin);
    //make sure settings are kept in sync
    mergedSettings.x.column = mergedSettings.time_col;
    mergedSettings.y.column = mergedSettings.value_col;
    controlInputs[0].value_col = mergedSettings.measure_col;

    //create controls now
    var controls = webcharts.createControls(element, { location: 'top', inputs: controlInputs });
    //create chart
    var chart = webcharts.createChart(element, mergedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}

var ReactResultsOverTime = (function (_React$Component) {
    _inherits(ReactResultsOverTime, _React$Component);

    function ReactResultsOverTime(props) {
        _classCallCheck(this, ReactResultsOverTime);

        _get(Object.getPrototypeOf(ReactResultsOverTime.prototype), 'constructor', this).call(this, props);
        this.state = {};
    }

    _createClass(ReactResultsOverTime, [{
        key: 'componentDidMount',
        value: function componentDidMount(prevProps, prevState) {
            if (this.props.data.length) {
                //manually clear div and redraw
                d3$1.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
                var chart = outlierExplorer('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.props.data.length) {
                //manually clear div and redraw
                d3$1.select('.chart-div.id-' + this.props.id).selectAll('*').remove();
                var chart = outlierExplorer('.chart-div.id-' + this.props.id, this.props.settings).init(this.props.data);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', {
                key: this.props.id,
                className: 'chart-div id-' + this.props.id + ' ' + (!this.props.data.length ? 'loading' : ''),
                style: { minHeight: '1px', minWidth: '1px' }
            });
        }
    }]);

    return ReactResultsOverTime;
})(React.Component);

ReactResultsOverTime.defaultProps = { data: [], controlInputs: [], id: 'id' };

//some very simple CSS to keep controls looking ok
var wrapperClass = 'cf-results-over-time';
var styles = '.' + wrapperClass + ' .control-group {\n  display: inline-block;\n  margin: 0 1em 1em 0;\n}\n\n.' + wrapperClass + ' .control-group .control-label {\n  display: block;\n}\n';

function describeCode(props) {
    var settings = this.createSettings(props);
    var code = '//uses d3 v.' + d3$1.version + '\n//uses webcharts v.' + webcharts.version + '\n\nvar settings = ' + JSON.stringify(this.state.settings, null, 2) + ';\n\nvar myChart = resultsOverTime(dataElement, settings);\n\nd3.csv(dataPath, function(error, csv) {\n  myChart.init(csv);\n});\n  ';
    return code;
}

var Renderer = (function (_React$Component2) {
    _inherits(Renderer, _React$Component2);

    function Renderer(props) {
        _classCallCheck(this, Renderer);

        _get(Object.getPrototypeOf(Renderer.prototype), 'constructor', this).call(this, props);
        this.binding = binding;
        this.describeCode = describeCode.bind(this);
        this.state = { data: [], settings: {}, template: {}, loadMsg: 'Loading...' };
    }

    _createClass(Renderer, [{
        key: 'createSettings',
        value: function createSettings(props) {
            var shell = {};

            binding.dataMappings.forEach(function (e) {
                var chartVal = stringAccessor(props.dataMappings, e.source);
                if (chartVal) {
                    stringAccessor(shell, e.target, chartVal);
                } else {
                    var defaultVal = stringAccessor(props.template.dataMappings, e.source + '.default');
                    if (defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0, 3) === 'dm$') {
                        var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
                        stringAccessor(shell, e.target, pointerVal);
                    } else if (defaultVal) {
                        stringAccessor(shell, e.target, defaultVal);
                    } else {
                        stringAccessor(shell, e.target, null);
                    }
                }
            });
            binding.chartProperties.forEach(function (e) {
                var chartVal = stringAccessor(props.chartProperties, e.source);
                if (chartVal !== undefined) {
                    stringAccessor(shell, e.target, chartVal);
                } else {
                    var defaultVal = stringAccessor(props.template.chartProperties, e.source + '.default');
                    stringAccessor(shell, e.target, defaultVal);
                }
            });

            return shell;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var settings = this.createSettings(this.props);
            this.setState({ settings: settings });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var settings = this.createSettings(nextProps);
            this.setState({ settings: settings });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { className: wrapperClass }, React.createElement('style', null, styles), React.createElement(ReactResultsOverTime, {
                id: this.props.id,
                settings: this.state.settings,
                controlInputs: this.props.template.controls,
                data: this.props.data
            }));
        }
    }]);

    return Renderer;
})(React.Component);

module.exports = Renderer;

