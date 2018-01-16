import { set } from 'd3';

export default function cleanData() {
    const allMeasures = set(this.raw_data.map(m => m[this.config.measure_col]))
            .values()
            .filter(measure => this.config.missingValues.indexOf(measure) === -1),
        catMeasures = allMeasures.filter(measure => {
            const allObservations = this.raw_data
                    .filter(d => d[this.config.measure_col] === measure)
                    .map(d => d[this.config.value_col]),
                numericObservations = allObservations.filter(d => /^-?[0-9.]+$/.test(d));

            return numericObservations.length < allObservations.length;
        });

    //Warn user of non-numeric endpoints.
    if (catMeasures.length)
        console.warn(
            `${catMeasures.length} non-numeric endpoint${catMeasures.length > 1
                ? 's have'
                : ' has'} been removed: ${catMeasures.join(', ')}`
        );

    //Attach array of continuous measures to chart object.
    this.measures = allMeasures.filter(measure => catMeasures.indexOf(measure) === -1).sort();

    //Remove dirty data.
    this.raw_data = this.raw_data.filter(
        d =>
            this.config.missingValues.indexOf(d[this.config.value_col]) === -1 &&
            catMeasures.indexOf(d[this.config.measure_col]) === -1
    );
}
