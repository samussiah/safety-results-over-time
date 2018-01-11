export default function updateYdomain() {
    var yMinSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'y.domain[0]')
        .select('input');

    var yMaxSelect = this.controls.wrap
        .selectAll('.control-group')
        .filter(f => f.option === 'y.domain[1]')
        .select('input');

    //switch the values if min > max
    var range = [yMinSelect.node().value, yMaxSelect.node().value].sort(function(a, b) {
        return a - b;
    });
    yMinSelect.node().value = range[0];
    yMaxSelect.node().value = range[1];

    //apply custom domain to the this
    this.config.y.domain = range;
    this.y_dom = range;
}
