import { quantile } from 'd3';

export default function addYAxisTicks() {
    //Manually draw y-axis ticks when none exist.
    if (!this.svg.selectAll('.y .tick')[0].length) {
        //Define quantiles of current measure results.
        const probs = [
            { probability: 0.05 },
            { probability: 0.25 },
            { probability: 0.5 },
            { probability: 0.75 },
            { probability: 0.95 }
        ];

        for (let i = 0; i < probs.length; i++) {
            probs[i].quantile = quantile(
                this.measure_data.map(d => +d[this.config.y.column]).sort((a, b) => a - b),
                probs[i].probability
            );
        }

        const ticks = [probs[1].quantile, probs[3].quantile];

        //Manually define y-axis tick values.
        this.yAxis.tickValues(ticks);

        //Transition the y-axis to draw the ticks.
        this.svg
            .select('g.y.axis')
            .transition()
            .call(this.yAxis);

        //Draw the gridlines.
        this.drawGridlines();
    }
}
