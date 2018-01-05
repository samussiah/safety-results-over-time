import { quantile, ascending } from 'd3';
import addBoxPlot from './onResize/addBoxPlot';
import addViolinPlot from './onResize/addViolinPlot';
import adjustTicks from './onResize/adjustTicks';

export default function onResize() {
    const config = this.config;

    //Hide Group control if only one grouping is specified.
    const groupControl = this.controls.wrap
        .selectAll('.control-group')
        .filter(controlGroup => controlGroup.label === 'Group');
    groupControl.style(
        'display',
        d => (d.values.length === 1 ? 'none' : groupControl.style('display'))
    );

    //Manually draw y-axis ticks when none exist.
    if (!this.svg.selectAll('.y .tick')[0].length) {
        const probs = [
            { probability: 0.05 },
            { probability: 0.25 },
            { probability: 0.5 },
            { probability: 0.75 },
            { probability: 0.95 }
        ];

        for (let i = 0; i < probs.length; i++) {
            probs[i].quantile = quantile(
                this.measure_data.map(d => +d[this.config.y.column]).sort(),
                probs[i].probability
            );
        }

        const ticks = [probs[1].quantile, probs[3].quantile];
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

    this.nested_data.forEach(e => {
        //Sort [ config.color_by ] groups.
        e.values = e.values.sort(
            (a, b) =>
                this.colorScale.domain().indexOf(a.key) < this.colorScale.domain().indexOf(b.key)
                    ? -1
                    : 1
        );

        //Define group object.
        let group = {};
        group.x = {
            key: e.key, // x-axis value
            nGroups: this.colorScale.domain().length, // number of groups at x-axis value
            width: this.x.rangeBand() // width of x-axis value
        };
        //Given an odd number of groups, center first box and offset the rest.
        //Given an even number of groups, offset all boxes.
        group.x.start = group.x.nGroups % 2 ? 0 : 1;

        e.values.forEach((v, i) => {
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
            group.results = v.values.sort(ascending).map(d => +d);

            if (this.x_dom.indexOf(group.x.key) > -1) {
                group.svg = this.svg
                    .append('g')
                    .attr({
                        class: 'boxplot-wrap overlay-item',
                        transform: 'translate(' + (this.x(group.x.key) + group.offset) + ',0)'
                    })
                    .datum({ values: group.results });

                if (config.boxplots) addBoxPlot(this, group);

                if (config.violins) addViolinPlot(this, group, this.colorScale(group.key));
            }
        });
    });
}
