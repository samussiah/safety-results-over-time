export default function removeGroupControl() {
    const groupControl = this.controls.wrap
        .selectAll('.control-group')
        .filter(controlGroup => controlGroup.label === 'Group');
    groupControl.style(
        'display',
        d => (d.values.length === 1 ? 'none' : groupControl.style('display'))
    );
}
