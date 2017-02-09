export default function onDraw() {
    this.marks[0].data
        .forEach(d => {
            d.values.sort((a,b) =>
                a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : d3.ascending(a.key, b.key));
        });

  //Nest filtered data.
    this.nested_data = d3.nest()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.color_by])
        .rollup(d => d.map(m => +m[this.config.y.column]))
        .entries(this.filtered_data);

  //Clear y-axis ticks.
    this.svg.selectAll('.y .tick').remove();
}
