import addResetButton from './onLayout/addResetButton';

export default function onLayout() {
    //Add population count container.
    this.controls.wrap
        .append('div')
        .attr('id', 'populationCount')
        .style('font-style', 'italic');

    //Distinguish controls to insert y-axis reset button in the correct position.
    this.controls.wrap
        .selectAll('.control-group')
        .attr('id', d => d.label.toLowerCase().replace(' ', '-'));

    //Add a button to reset the y-domain
    addResetButton.call(this);

    //Add y-axis class to y-axis limit controls.
    this.controls.wrap
        .selectAll('.control-group')
        .filter(d => ['Lower Limit', 'Upper Limit'].indexOf(d.label) > -1)
        .classed('y-axis', true);
}
