import { select } from 'd3';

export default function classControlGroups() {
    this.controls.wrap.selectAll('.control-group').each(function(d) {
        const controlGroup = select(this);
        controlGroup.classed(
            `${d.type.toLowerCase().replace(' ', '-')} ${d.label.toLowerCase().replace(' ', '-')}`,
            true
        );

        //Add y-axis class to group y-axis controls.
        if (d.grouping) controlGroup.classed(d.grouping, true);

        //Float all checkboxes right.
        if (d.type === 'checkbox')
            controlGroup.style({
                float: 'right',
                clear: 'right',
                margin: '0'
            });
    });
}
