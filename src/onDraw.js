import { ascending, nest } from 'd3';
import updateParticipantCount from './onDraw/updateParticipantCount';
import updateYdomain from './onDraw/updateYdomain';

export default function onDraw() {
    //Annotate population count.
    updateParticipantCount(this, '#populationCount');

    //idk
    this.marks[0].data.forEach(d => {
        d.values.sort(
            (a, b) => (a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : ascending(a.key, b.key))
        );
    });

    //Nest filtered data.
    this.nested_data = nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.color_by])
        .rollup(d => d.map(m => +m[this.config.y.column]))
        .entries(this.filtered_data);

    //Clear y-axis ticks.
    this.svg.selectAll('.y .tick').remove();

    //Make nested data set for boxplots
    this.nested_data = nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.marks[0].per[0]])
        .rollup(d => {
            return d.map(m => +m[this.config.y.column]);
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
