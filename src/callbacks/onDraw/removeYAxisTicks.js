export default function removeYAxisTicks() {
    this.svg.selectAll('.y.axis .tick').remove();
}
