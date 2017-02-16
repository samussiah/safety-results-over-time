export default function onPreprocess() {
  //Capture currently selected measure.
    const measure = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.value_col && d.value_col === this.config.measure_col)
        .select('option:checked')
        .text();

  //Filter data and nest data by visit and group.
    this.measure_data = this.raw_data
        .filter(d => d[this.config.measure_col] === measure);
    const nested_data = d3.nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.color_by])
        .rollup(d => d.map(m => +m[this.config.y.column]))
        .entries(this.measure_data);

  //Define y-axis range based on currently selected measure.
    if (!this.config.violins) {
        const y_05s = [];
        const y_95s = [];
        nested_data
            .forEach(visit => {
                visit.values
                    .forEach(group => {
                        var results = group.values
                            .sort(d3.ascending);
                            y_05s.push(d3.quantile(results, 0.05));
                            y_95s.push(d3.quantile(results, 0.95));
                    });
            });
        this.config.y.domain =
            [Math.min.apply(null, y_05s)
            ,Math.max.apply(null, y_95s)];
    } else
        this.config.y.domain = d3.extent(
            this.measure_data
                .map(d => +d[this.config.y.column]));
}
