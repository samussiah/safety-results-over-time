export default function setLegendLabel() {
    this.config.legend.label =
        this.config.color_by !== 'srot_none'
            ? this.config.groups[
                  this.config.groups.map(group => group.value_col).indexOf(this.config.color_by)
              ].label
            : '';
}
