export default function onDataTransform() {
  //Redefine y-axis label.
    this.config.y.label = `${this.measure_data[0][this.config.measure_col]} (${this.measure_data[0][this.config.unit_col]})`;
  //Redefine legend label.
    const group_value_cols = this.config.groups
        .map(group => group.value_col
            ? group.value_col
            : group);
    const group_labels = this.config.groups
        .map(group => group.label
            ? group.label
            : group.value_col
                ? group.value_col
                : group);
    const group = this.config.color_by;

    if (group !== 'NONE')
        this.config.legend.label = group_labels[group_value_cols.indexOf(group)];
    else
        this.config.legend.label = '';
}
