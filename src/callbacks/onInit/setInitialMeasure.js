export default function setInitialMeasure() {
    const measureInput = this.controls.config.inputs.find(input => input.label === 'Measure');
    measureInput.values = this.srot_measures;
    if (
        this.config.start_value &&
        this.srot_measures.indexOf(this.config.start_value) < 0 &&
        this.measures.indexOf(this.config.start_value) < 0
    ) {
        measureInput.start = this.srot_measures[0];
        console.warn(
            `${this.config.start_value} is an invalid measure. Defaulting to ${measureInput.start}.`
        );
    } else if (this.config.start_value && this.srot_measures.indexOf(this.config.start_value) < 0) {
        measureInput.start = this.srot_measures[this.measures.indexOf(this.config.start_value)];
        console.warn(
            `${this.config.start_value} is missing the units value. Defaulting to ${
                measureInput.start
            }.`
        );
    } else measureInput.start = this.config.start_value || this.srot_measures[0];
}
