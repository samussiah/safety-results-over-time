export default function removeDuplicateTickLabels() {
    //Manually remove excess y-axis ticks.
    const tickLabels = [];
    this.svg.selectAll('.y.axis .tick').each(function(d) {
        const tick = d3.select(this);
        const label = tick.select('text');

        if (label.size()) {
            const tickLabel = label.text();

            //Check if tick value already exists on axis and if so, remove.
            if (tickLabels.indexOf(tickLabel) < 0) tickLabels.push(tickLabel);
            else label.remove();
        }
    });
}
