export default function onLayout() {
    //Add population count container.
    this.controls.wrap
        .append('div')
        .attr('id', 'populationCount')
        .style('font-style', 'italic');
}
