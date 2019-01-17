import { quantile } from 'd3';

export default function removeYAxisTicks() {
    //Manually remove excess y-axis ticks.
    if (this.config.y.type === 'log') {
        const tickValues = [];
        this.svg.selectAll('.y.axis .tick').each(function(d) {
            const tick = d3.select(this);
            const tickValue = tick.select('text').text();

            //Check if tick value already exists on axis and if so, remove.
            if (tickValues.indexOf(tickValue) < 0) tickValues.push(tickValue);
            else tick.remove();
        });
    }
}
