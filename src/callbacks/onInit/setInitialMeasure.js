export default function setInitialMeasure() {
    const measureInput = this.controls.config.inputs.find(input => input.label === 'Measure');
    if (this.config.start_value && this.measures.indexOf(this.config.start_value) < 0) {
        measureInput.start = this.measures[0];
        console.warn(
            `${this.config.start_value} is an invalid measure. Defaulting to ${measureInput.start}.`
        );
    } else if (!this.config.start_value) measureInput.start = this.measures[0];
}
