export default function removeLegend() {
    if (this.config.color_by === 'NONE') this.wrap.select('.legend').remove();
}
