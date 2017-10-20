import { set } from 'd3';
import { dataOps } from 'webcharts';

export default function onInit() {
    const config = this.config;

    //'All'variable for non-grouped comparisons
    this.raw_data.forEach(d => {
        d.NONE = 'All Subjects';
    });

    //Drop missing values
    this.populationCount = set(this.raw_data.map(d => d[config.id_col])).values().length;
    this.raw_data = this.raw_data.filter(f => {
        return config.missingValues.indexOf(f[config.value_col]) === -1;
    });

    //Remove measures with any non-numeric results.
    const allMeasures = set(this.raw_data.map(m => m[config.measure_col])).values(),
        catMeasures = allMeasures.filter(measure => {
            const allObservations = this.raw_data
                    .filter(d => d[config.measure_col] === measure)
                    .map(d => d[config.value_col]),
                numericObservations = allObservations.filter(d => /^-?[0-9.]+$/.test(d));

            return numericObservations.length < allObservations.length;
        }),
        conMeasures = allMeasures.filter(measure => catMeasures.indexOf(measure) === -1);

    if (catMeasures.length)
        console.warn(
            `${catMeasures.length} non-numeric endpoint${catMeasures.length > 1
                ? 's have'
                : ' has'} been removed: ${catMeasures.join(', ')}`
        );

    this.raw_data = this.raw_data.filter(d => catMeasures.indexOf(d[config.measure_col]) === -1);

    // Remove filters for variables with 0 or 1 levels
    var chart = this;

    this.controls.config.inputs = this.controls.config.inputs.filter(function(d) {
        if (d.type != 'subsetter') {
            return true;
        } else {
            var levels = d3.set(chart.raw_data.map(f => f[d.value_col])).values();
            if (levels.length < 2) {
                console.warn(
                    d.value_col + ' filter not shown since the variable has less than 2 levels'
                );
            }
            return levels.length >= 2;
        }
    });

    //Choose the start value for the Test filter
    this.controls.config.inputs.filter(input => input.label === 'Measure')[0].start =
        this.config.start_value || conMeasures[0];
}
