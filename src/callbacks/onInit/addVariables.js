export default function addVariables() {
    this.raw_data.forEach(d => {
        //Convert results to numeric
        d[this.config.y.column] = parseFloat(d[this.config.y.column]);

        //Concatenate unit to measure if provided.
        d.srot_measure = d.hasOwnProperty(this.config.unit_col)
            ? `${d[this.config.measure_col]} (${d[this.config.unit_col]})`
            : d[this.config.measure_col];

        //Add placeholder variable for non-grouped comparisons.
        d.srot_none = 'All Participants';

        //Flag unscheduled visits.
        //d.srot_unscheduled = this.config.unscheduled_visit_values
        //    ? this.config.unscheduled_visit_values.indexOf(d[this.config.time_settings.value_col]) >
        //      -1
        //    : this.config.unscheduled_visit_regex
        //      ? this.config.unscheduled_visit_regex.test(d[this.config.time_settings.value_col])
        //      : false;

        //Add placeholder variable for outliers.
        d.srot_outlier = null;
    });
}
