import { select } from 'd3';

export default function classControlGroups() {
    this.controls.wrap.selectAll('.control-group').each(function(d) {
        const controlGroup = select(this);
        controlGroup.classed(d.label.toLowerCase().replace(' ', '-'), true);
        if (['Lower Limit', 'Upper Limit'].indexOf(d.label) > -1)
            controlGroup.classed('y-axis', true);
    });
}
