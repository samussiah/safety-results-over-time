var bundle = (function (React,d3$1,webcharts) {
  'use strict';

  React = 'default' in React ? React['default'] : React;

  function stringAccessor(o, s, v) {
  	//adapted from http://jsfiddle.net/alnitak/hEsys/
      s = s.replace(/\[(\w+)\]/g, '.$1');
      s = s.replace(/^\./, '');           
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              if(i == n-1 && v !== undefined)
                  o[k] = v;
              o = o[k];
          } else {
              return;
          }
      }
      return o;
  }

  var binding = {
  	dataMappings : [
  		{
  			source:"x",
  			target:"x.column"
  		},
  		{
  			source:"x_order",
  			target:"x.order"
  		},
  		{
  			source:"x_domain",
  			target:"x.domain"
  		},
  		{
  			source:"y",
  			target:"y.column"
  		},
  		{
  			source:"y_order",
  			target:"y.order"
  		},
  		{
  			source:"y_domain",
  			target:"y.domain"
  		},
  		{
  			source:"group",
  			target:"marks.0.per"
  		},
  		{
  			source:"subgroup",
  			target:"marks.0.split"
  		},
  		{
  			source:"subset",
  			target:"marks.0.values"
  		},
  		{
  			source:"color_by",
  			target:"color_by"
  		},
  		{
  			source:"legend_order",
  			target:"legend.order"
  		},
  		{
  			source:"tooltip",
  			target:"marks.0.tooltip"
  		}
  	],
  	chartProperties: [
  		{
  			source:"date_format",
  			target:"date_format"
  		},
  		{
  			source:"x_label",
  			target:"x.label"
  		},

  		{
  			source:"x_type",
  			target:"x.type"
  		},
  		{
  			source:"x_format",
  			target:"x.format"
  		},
  		{
  			source:"x_sort",
  			target:"x.sort"
  		},
  		{
  			source:"x_bin",
  			target:"x.bin"
  		},
  		{
  			source:"x_behavior",
  			target:"x.behavior"
  		},
  		{
  			source:"y_label",
  			target:"y.label"
  		},
  		{
  			source:"y_type",
  			target:"y.type"
  		},
  		{
  			source:"y_format",
  			target:"y.format"
  		},
  		{
  			source:"y_sort",
  			target:"y.sort"
  		},
  		{
  			source:"y_behavior",
  			target:"y.behavior"
  		},
  		{
  			source:"marks_type",
  			target:"marks.0.type"
  		},
  		{
  			source:"marks_summarizeX",
  			target:"marks.0.summarizeX"
  		},
  		{
  			source:"marks_summarizeY",
  			target:"marks.0.summarizeY"
  		},
  		{
  			source:"marks_arrange",
  			target:"marks.0.arrange"
  		},
  		{
  			source:"marks_fill_opacity",
  			target:"marks.0.attributes.fill-opacity"
  		},
  		{
  			source:"aspect_ratio",
  			target:"aspect"
  		},
  		{
  			source:"range_band",
  			target:"range_band"
  		},
  		{
  			source:"colors",
  			target:"colors"
  		},
  		{
  			source:"gridlines",
  			target:"gridlines"
  		},
  		{
  			source:"max_width",
  			target:"max_width"
  		},
  		{
  			source:"resizable",
  			target:"resizable"
  		},
  		{
  			source:"scale_text",
  			target:"scale_text"
  		},
  		{
  			source: "legend_mark",
  			target: "legend.mark"
  		},
  		{
  			source: "legend_label",
  			target: "legend.label"
  		}
  	]
  }

  const settings = {
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
      missingValues: ["NA",""],
      //Standard webcharts settings
      x:{
          column:"VISITN",
          type:"ordinal",
          label:null,
          sort:"alphabetical-ascending"
      },
      y:{
          column:"STRESN",
          stat:"mean",
          type:"linear",
          label:"Value",
          behavior:"flex",
          format:"0.2f"
      },
      marks:[
          {
              type:"line",
              per:[
                  "ALL"
              ],
              attributes:{
                  'stroke-width': 2, 
                  'stroke-opacity': 1
              }
          }
      ],
      legend: {
          label: ''
      },
      color_by: 'ALL',
      resizable:true,
      max_width: 600,
      margin:{bottom:50},
      aspect: 1.33,
      gridlines: 'xy'
  };

  const controlInputs = [ 
      {
          label:"Measure", 
          value_col: "TEST", 
          type: "subsetter",  
          start: null
      },
      {
          label:"Group", 
          options: ["marks.0.per.0","color_by"], 
          type: "dropdown", 
          require: true, 
          values: ['ALL', 'SEX', 'RACE'],
          start:"ALL"
      }
  ];

  function onInit(){
      const config = this.config;
      const allMeasures = d3$1.set(this.raw_data.map(m => m[config.measure_col])).values();

      // "All" variable for non-grouped comparisons
      this.raw_data.forEach(e => e.ALL = "All" );
      
      //Drop missing values
      this.raw_data = this.raw_data.filter(f => {
          return config.missingValues.indexOf(f[config.value_col]) === -1;
      })

      //warning for non-numeric endpoints
      var catMeasures = allMeasures
          .filter(f => {
              var measureVals = this.raw_data
                  .filter(d => d[config.measure_col] === f);

              return webcharts.dataOps.getValType(measureVals, config.value_col) !== "continuous";
          });
      if(catMeasures.length){
          console.warn(catMeasures.length + " non-numeric endpoints have been removed: "+catMeasures.join(", "))    
      }
      
      //delete non-numeric endpoints
      var numMeasures = allMeasures
          .filter(f => {
              var measureVals = this.raw_data
                  .filter(d => d[config.measure_col] === f );

              return webcharts.dataOps.getValType(measureVals, config.value_col) === "continuous";
          });

      this.raw_data = this.raw_data.filter(f => numMeasures.indexOf(f[config.measure_col]) > -1 );

      //Choose the start value for the Test filter
      this.controls.config.inputs[0].start = this.config.startValue || numMeasures[0]; 

  };

  function onLayout(){

  }

  function onDataTransform(){

  }

  function onDraw(){
    this.marks[0].data.forEach(e => {
        e.values.sort((a,b) => {
            return a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : d3$1.ascending(a.key, b.key);
        });
    });

    var sortVar = this.config.x.column;

    // Make nested data set for boxplots
    this.nested_data = d3$1.nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.marks[0].per[0]])
        .rollup(d => {
          return d.map(m => +m[this.config.y.column]);
        })
        .entries(this.filtered_data);

    // y-domain for box plots
    var y_05s = [];
    var y_95s = [];
    this.nested_data.forEach(function(e){
        e.values.forEach(function(v,i){
          var results = v.values
            .sort(d3$1.ascending);
            y_05s.push(d3$1.quantile(results, 0.05));
            y_95s.push(d3$1.quantile(results, 0.95));
        });
    });
    this.y_dom[0] = Math.min.apply(null, y_05s);
    this.y_dom[1] = Math.max.apply(null, y_95s);

    // x domain
    var visits = d3$1.set( this.filtered_data.map(m => m[this.config.x.column] ) )
      .values()
      .sort(function(a,b){
        return a === 'NA' ? 1 : b === 'NA' ? -1 : d3$1.ascending(+a, +b);
      });

    this.config.x_dom = visits;
  }

  function addBoxplot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor, format, horizontal){
      //set default orientation to "horizontal"
      var horizontal = horizontal==undefined ? true : horizontal 

      //make the results numeric and sort
      var results = results.map(function(d){return +d}).sort(d3.ascending)

      //set up scales
      var y = d3.scale.linear()
      .range([height, 0])

      var x = d3.scale.linear()
      .range([0, width])

      if(horizontal){
          y.domain(domain)
      }else{
          x.domain(domain)
      }

      var probs=[0.05,0.25,0.5,0.75,0.95];
      for(var i=0; i<probs.length; i++){
          probs[i]=d3.quantile(results, probs[i])
      }

      var boxplot = svg.append("g")
      .attr("class","boxplot")
      .datum({values:results, probs:probs})

      //set bar width variable
      var left=horizontal ? 0.5-boxPlotWidth/2 : null
      var right=horizontal ? 0.5+boxPlotWidth/2 : null
      var top = horizontal ? null : 0.5-boxPlotWidth/2 
      var bottom = horizontal ? null : 0.5+boxPlotWidth/2

      //draw rectangle from q1 to q3
      var box_x = horizontal ? x(0.5-boxPlotWidth/2) : x(probs[1])
      var box_width = horizontal ? x(0.5+boxPlotWidth/2)-x(0.5-boxPlotWidth/2) : x(probs[3])-x(probs[1])
      var box_y = horizontal ? y(probs[3]) : y(0.5+boxPlotWidth/2)
      var box_height = horizontal ? (-y(probs[3])+y(probs[1])) : y(0.5-boxPlotWidth/2)-y(0.5+boxPlotWidth/2)

      boxplot.append("rect")
      .attr("class", "boxplot fill")
      .attr("x", box_x)
      .attr("width", box_width)
      .attr("y", box_y)
      .attr("height", box_height)
      .style("fill", boxColor);

      //draw dividing lines at median, 95% and 5%
      var iS=[0,2,4];
      var iSclass=["","median",""];
      var iSColor=[boxColor, boxInsideColor, boxColor]
      for(var i=0; i<iS.length; i++){
          boxplot.append("line")
          .attr("class", "boxplot "+iSclass[i])
          .attr("x1", horizontal ? x(0.5-boxPlotWidth/2) : x(probs[iS[i]]))
          .attr("x2", horizontal ? x(0.5+boxPlotWidth/2) : x(probs[iS[i]]))
          .attr("y1", horizontal ? y(probs[iS[i]]) : y(0.5-boxPlotWidth/2))
          .attr("y2", horizontal ? y(probs[iS[i]]) : y(0.5+boxPlotWidth/2))
          .style("fill", iSColor[i])
          .style("stroke", iSColor[i])
      }

      //draw lines from 5% to 25% and from 75% to 95%
      var iS=[[0,1],[3,4]];
      for(var i=0; i<iS.length; i++){
          boxplot.append("line")
          .attr("class", "boxplot")
          .attr("x1", horizontal ? x(0.5) : x(probs[iS[i][0]]))
          .attr("x2", horizontal ? x(0.5) : x(probs[iS[i][1]]))
          .attr("y1", horizontal ? y(probs[iS[i][0]]) : y(0.5))
          .attr("y2", horizontal ? y(probs[iS[i][1]]) : y(0.5))
          .style("stroke", boxColor);
      }

      boxplot.append("circle")
      .attr("class", "boxplot mean")
      .attr("cx", horizontal ? x(0.5):x(d3.mean(results)))
      .attr("cy", horizontal ? y(d3.mean(results)):y(0.5))
      .attr("r", horizontal ? x(boxPlotWidth/3) : y(1-boxPlotWidth/3))
      .style("fill", boxInsideColor)
      .style("stroke", boxColor);

      boxplot.append("circle")
      .attr("class", "boxplot mean")
      .attr("cx", horizontal ? x(0.5):x(d3.mean(results)))
      .attr("cy", horizontal ? y(d3.mean(results)):y(0.5))
      .attr("r", horizontal ? x(boxPlotWidth/6) : y(1-boxPlotWidth/6))
      .style("fill", boxColor)
      .style("stroke", 'None');

      var formatx = format ? d3.format(format) : d3.format(".2f");

      boxplot.selectAll(".boxplot").append("title").text(function(d){
          return "N = "+d.values.length+"\n"+
          "Min = "+d3.min(d.values)+"\n"+
          "5th % = "+formatx(d3.quantile(d.values, 0.05))+"\n"+
          "Q1 = "+formatx(d3.quantile(d.values, 0.25))+"\n"+
          "Median = "+formatx(d3.median(d.values))+"\n"+
          "Q3 = "+formatx(d3.quantile(d.values, 0.75))+"\n"+
          "95th % = "+formatx(d3.quantile(d.values, 0.95))+"\n"+
          "Max = "+d3.max(d.values)+"\n"+
          "Mean = "+formatx(d3.mean(d.values))+"\n"+
          "StDev = "+formatx(d3.deviation(d.values));
      });
  }

  function onResize(){
      const config = this.config;
      const units = this.filtered_data[0][config.unit_col];
      const measure = this.filtered_data[0][config.measure_col];

      this.svg.select(".y.axis").select(".axis-title").text(measure+" level ("+units+")");


      //draw reference boxplot 
      this.svg.selectAll(".boxplot-wrap").remove();

      this.nested_data.forEach(e => {
          e.values.forEach((v,i) => {
              var index = this.colorScale.domain().indexOf(v.key);
              var sign = index%2 === 0 ? -1 : 1;
              var multiplier = index === 1 ? 1 : Math.floor(index/2)
              var offset = (sign*multiplier*this.colorScale.domain().length*4)
              var results = v.values.sort(d3$1.ascending).map(function(d){return +d});
              if(this.x_dom.indexOf(e.key)>-1){
                 var g = this.svg
                  .append("g")
                  .attr("class", "boxplot-wrap overlay-item")
                  .attr("transform", "translate("+(this.x(e.key)+offset)+",0)")
                  .datum({values: results})

                  var boxPlotWidth = this.colorScale.domain().length === 1 ? 1 : 
                      this.colorScale.domain().length === 2 ? 0.33  :
                      0.25;
                  
                  addBoxplot(
                      g, //svg
                      results, //results 
                      this.plot_height, //height 
                      this.x.rangeBand(), //width 
                      this.y.domain(), //domain 
                      boxPlotWidth, //boxPlotWidth 
                      this.colorScale(v.key), //boxColor 
                      "#eee" //boxInsideColor 
                  );
              }
          });
      });

  }

  function outlierExplorer(element, settings$$){
  	//merge user's settings with defaults
  	let mergedSettings = Object.assign({}, settings, settings$$);
  	//make sure settings are kept in sync
  	mergedSettings.x.column = mergedSettings.time_col;
  	mergedSettings.y.column = mergedSettings.value_col;
  	controlInputs[0].value_col = mergedSettings.measure_col;

  	//create controls now
  	let controls = webcharts.createControls(element, {location: 'top', inputs: controlInputs});
  	//create chart
  	let chart = webcharts.createChart(element, mergedSettings, controls);
  	chart.on('init', onInit);
  	chart.on('layout', onLayout);
  	chart.on('datatransform', onDataTransform);
  	chart.on('draw', onDraw);
  	chart.on('resize', onResize);

  	return chart;
  }

  class ReactResultsOverTime extends React.Component {
  	constructor(props) {
  		super(props);
  		this.state = {};
  	}
  	componentDidMount(prevProps, prevState){
  		if(this.props.data.length){
  			//manually clear div and redraw
  			d3$1.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
  			let chart = outlierExplorer(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
  		}
  	}
  	componentDidUpdate(prevProps, prevState){
  		if(this.props.data.length){
  			//manually clear div and redraw
  			d3$1.select(`.chart-div.id-${this.props.id}`).selectAll('*').remove();
  			let chart = outlierExplorer(`.chart-div.id-${this.props.id}`, this.props.settings).init(this.props.data);
  		}
  	}
  	render(){
  		return (
  			React.createElement('div', {
  				key: this.props.id,
  				className: `chart-div id-${this.props.id} ${!(this.props.data.length) ? 'loading' : ''}`,
  				style: { minHeight: '1px', minWidth: '1px' }
  			})
  		);
  	}
  }

  ReactResultsOverTime.defaultProps = {data: [], controlInputs: [], id: 'id'}

  //some very simple CSS to keep controls looking ok
  const wrapperClass = 'cf-results-over-time';
  const styles = `.${wrapperClass} .control-group {
  display: inline-block;
  margin: 0 1em 1em 0;
}

.${wrapperClass} .control-group .control-label {
  display: block;
}
`;


  function describeCode(){
      console.log(d3$1.version)
      
      const code = `//uses d3 v.${d3$1.version}
//uses webcharts v.${webcharts.version}
var settings = ${JSON.stringify(this.state.settings, null, 2)};

var myChart = resultsOverTime(div, settings);

d3.csv(dataPath, function(error, csv) {
  myChart.init(data);
});
    `;
      console.log(code)
    }

  class Renderer extends React.Component {
    constructor(props) {
      super(props);
      this.binding = binding;
      this.describeCode = describeCode.bind(this);
      this.state = {data: [], settings: {}, template: {}, loadMsg: 'Loading...'};
    }
    createSettings(props) {
      const shell = {};
      
      binding.dataMappings.forEach(e => {
        let chartVal = stringAccessor(props.dataMappings, e.source);
        if(chartVal ){
          stringAccessor(shell, e.target, chartVal);
        }
        else{
          let defaultVal = stringAccessor(props.template.dataMappings, e.source+'.default');
          if(defaultVal && typeof defaultVal === 'string' && defaultVal.slice(0,3) === 'dm$'){
            var pointerVal = stringAccessor(props.dataMappings, defaultVal.slice(3)) || null;
            stringAccessor(shell, e.target, pointerVal);
          }
          else if(defaultVal){
            stringAccessor(shell, e.target, defaultVal);
          }
          else{
            stringAccessor(shell, e.target, null);
          }
        } 
      });
      binding.chartProperties.forEach(e => {
        let chartVal = stringAccessor(props.chartProperties, e.source);
        if(chartVal !== undefined){
          stringAccessor(shell, e.target, chartVal);
        }
        else{
          let defaultVal = stringAccessor(props.template.chartProperties, e.source+'.default');
          stringAccessor(shell, e.target, defaultVal);
        } 
      });

      this.setState({settings: shell, loadMsg: ''});
    }
    componentWillMount() {
      this.createSettings(this.props);
    }
    componentWillReceiveProps(nextProps){
      this.createSettings(nextProps);
    }
    render() {
      return (
        React.createElement('div', {className: wrapperClass}, 
          React.createElement('style', null, styles),
          React.createElement(ReactResultsOverTime, {
            id: this.props.id,
            settings: this.state.settings, 
            controlInputs: this.props.template.controls,
            data: this.props.data
          })
        )
      );
    }
  }

  return Renderer;

}(React,d3,webCharts));