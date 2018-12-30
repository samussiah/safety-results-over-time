import * as d3 from 'd3';

export default function defineMeasureData() {
    //Filter raw data on selected measure.
    this.measure_data = this.raw_data.filter(
        d => d[this.config.measure_col] === this.currentMeasure
    );

    //Apply filter to measure data.
    this.filtered_measure_data = this.measure_data;
    this.filters.forEach(filter => {
        this.filtered_measure_data = this.filtered_measure_data.filter(d => {
            return Array.isArray(filter.val)
                ? filter.val.indexOf(d[filter.col]) > -1
                : filter.val === d[filter.col] || filter.val === 'All';
        });
    });

    //Nest data and calculate summary statistics for each visit-group combination.
    this.nested_measure_data = d3['nest']()
        .key(d => d[this.config.x.column])
        .key(d => d[this.config.color_by])
        .rollup(d => {
            const results = {
                values: d.map(m => +m[this.config.y.column]).sort(d3['ascending']),
                n: d.length
            };

            //Calculate summary statistics.
            [
                'min',
                ['quantile', 0.05],
                ['quantile', 0.25],
                'median',
                ['quantile', 0.75],
                ['quantile', 0.95],
                'max',
                'mean',
                'deviation'
            ].forEach(item => {
                const fx = Array.isArray(item) ? item[0] : item;
                const stat = Array.isArray(item) ? `${fx.substring(0, 1)}${item[1] * 100}` : fx;
                results[stat] = Array.isArray(item)
                    ? d3[fx](results.values, item[1])
                    : d3[fx](results.values);
            });

            return results;
        })
        .entries(this.filtered_measure_data);
}
