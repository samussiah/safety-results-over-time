import { ascending } from 'd3';
import addBoxplot from './addBoxplot';
import adjustTicks from './adjust-ticks';

export default function onResize(){
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
            var results = v.values.sort(ascending).map(function(d){return +d});
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

    // rotate ticks
    if (config.x.tickAttr) {
        adjustTicks.call(this, 'x', 0, 0, config.x.tickAttr.rotate, config.x.tickAttr.anchor);
    }

}