import clone from '../util/clone';
import { ascending } from 'd3';
import addBoxPlot from './drawPlots/addBoxPlot';
import addViolinPlot from './drawPlots/addViolinPlot';
import addSummaryStatistics from './drawPlots/addSummaryStatistics';

export default function drawPlots() {
    this.nested_measure_data.filter(d => this.x_dom.indexOf(d.key) > -1).forEach(d => {
        //Sort [ config.color_by ] groups.
        d.values = d.values.sort(
            (a, b) =>
                this.colorScale.domain().indexOf(a.key) < this.colorScale.domain().indexOf(b.key)
                    ? -1
                    : 1
        );

        //Define group object.
        const group = {
            x: {
                key: d.key, // x-axis value
                nGroups: this.colorScale.domain().length, // number of groups at x-axis value
                width: this.x.rangeBand() // width of x-axis value
            },
            subgroups: []
        };
        group.x.start = -(group.x.nGroups / 2) + 0.5;
        group.distance = group.x.width / group.x.nGroups;

        d.values.forEach((di, i) => {
            const subgroup = {
                group,
                key: di.key,
                offset: (group.x.start + i) * group.distance,
                results: di.values.sort(ascending).map(value => +value)
            };
            subgroup.svg = this.svg
                .append('g')
                .attr({
                    class: 'boxplot-wrap overlay-item',
                    transform: 'translate(' + (this.x(group.x.key) + subgroup.offset) + ',0)'
                })
                .datum({ values: subgroup.results });
            group.subgroups.push(subgroup);

            if (this.config.boxplots) addBoxPlot(this, subgroup);
            if (this.config.violins) addViolinPlot(this, subgroup, this.colorScale(subgroup.key));
            addSummaryStatistics.call(this, subgroup);
        });
    });
}
