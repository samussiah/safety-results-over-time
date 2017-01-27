import { ascending } from 'd3';
import addBoxplot from './util/addBoxplot';
import addViolinPlot from './util/addViolinPlot';
import adjustTicks from './util/adjustTicks';

export default function onResize() {
    const config = this.config;

  //Rotate x-axis tick labels.
    if (config.time_settings.rotate_tick_labels)
        this.svg
            .selectAll('.x.axis .tick text')
            .attr(
                {'transform': 'rotate(-45)'
                ,'dx': -10
                ,'dy': 10})
            .style('text-anchor', 'end');

  //Draw reference boxplot.
    this.svg.selectAll('.boxplot-wrap').remove();

  //Count number of groups.
    const nGroups = this.colorScale.domain().length;
  //Given an odd number of groups, center first box and offset the rest.
  //Given an even number of groups, offset all boxes.
    const start = nGroups % 2 ? 0 : 1;
    const width = this.x.rangeBand();

    this.nested_data.forEach(e => {
      //Sort [ config.color_by ] groups.
        e.values = e.values
            .sort((a,b) =>
                this.colorScale.domain().indexOf(a.key) <
                this.colorScale.domain().indexOf(b.key) ? -1 : 1);

        e.values.forEach((v,i) => {
          //Calculate direction in which to offset each box plot.
            const direction = i > 0
                ? Math.pow(-1, i % 2)*(start ? 1 : -1)
                : start;
          //Calculate multiplier of offset distance.
            const multiplier =  Math.round((i + start)/2);
          //Calculate offset distance as a function of the x-axis range band, number of groups, and whether
          //the number of groups is even or odd.
            const distance = width/nGroups;
            const distanceOffset = start*(-1)*direction*width/nGroups/2;
          //Calculate offset.
            const offset = direction * multiplier * distance + distanceOffset;
          //Capture all results within visit and group.
            const results = v.values
                .sort(ascending)
                .map(d => +d);

            if (this.x_dom.indexOf(e.key) > -1) {
                const g = this.svg
                    .append('g')
                    .attr('class', 'boxplot-wrap overlay-item')
                    .attr('transform', 'translate('+(this.x(e.key)+offset)+',0)')
                    .datum({values: results})

                if (config.boxplots) {
                    addBoxplot(
                        g, //svg
                        results, //results 
                        this.plot_height, //height 
                        width, //width 
                        this.y.domain(), //domain 
                        .75/nGroups, //boxPlotWidth 
                        this.colorScale(v.key), //boxColor 
                        '#eee' //boxInsideColor 
                    );
                }

                if (config.violins) {
                    addViolinPlot(
                        g, //svg
                        results, //results
                        this.plot_height, //height
                        width, //width
                        this.y.domain(), //domain
                        1/nGroups/3, //violinPlotWidth
                        '#ccc7d6' //violinPlotColor
                    );
                }
            }
        });
    });
}
