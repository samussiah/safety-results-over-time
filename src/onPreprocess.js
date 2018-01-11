import { nest, ascending, quantile, extent } from 'd3';

export default function onPreprocess() {
    //Capture currently selected measure.
    const measure = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.value_col && d.value_col === this.config.measure_col)
        .select('option:checked')
        .text();

    //Filter data and nest data by visit and group.
    this.measure_data = this.raw_data.filter(d => d[this.config.measure_col] === measure);
    const nested_data = nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.color_by])
        .rollup(d => d.map(m => +m[this.config.y.column]))
        .entries(this.measure_data);

    //Define y-axis range based on currently selected measure.
    if (!this.config.violins) {
        const y_05s = [];
        const y_95s = [];
        nested_data.forEach(visit => {
            visit.values.forEach(group => {
                var results = group.values.sort(ascending);
                y_05s.push(quantile(results, 0.05));
                y_95s.push(quantile(results, 0.95));
            });
        });
        this.config.y.domain = [Math.min.apply(null, y_05s), Math.max.apply(null, y_95s)];
    } else this.config.y.domain = extent(this.measure_data.map(d => +d[this.config.y.column]));

    //Check if the selected measure has changed.
    const prevMeasure = this.currentMeasure;
    this.currentMeasure = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.value_col && d.value_col === this.config.measure_col)
        .select('option:checked')
        .text();
    const changedMeasureFlag = this.currentMeasure !== prevMeasure;

    //Set y-axis domain.
    if (changedMeasureFlag) {
        //reset axis to full range when measure changes
        this.config.y.domain = extent(this.measure_data, d => +d[this.config.value_col]);
        this.controls.wrap
            .selectAll('.y-axis')
            .property(
                'title',
                `Initial Limits: [${this.config.y.domain[0]} - ${this.config.y.domain[1]}]`
            );

        //Set y-axis domain controls.
        this.controls.wrap
            .selectAll('.control-group')
            .filter(f => f.option === 'y.domain[0]')
            .select('input')
            .property('value', this.config.y.domain[0]);
        this.controls.wrap
            .selectAll('.control-group')
            .filter(f => f.option === 'y.domain[1]')
            .select('input')
            .property('value', this.config.y.domain[1]);
    }
}
