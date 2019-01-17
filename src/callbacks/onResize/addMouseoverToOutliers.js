export default function addMouseoverToOutliers() {
    this.marks.forEach((mark, i) => (mark.hidden = this.config.marks[i].hidden));
    this.marks.filter(mark => mark.type === 'circle').forEach(mark => {
        mark.groups
            .each(function(d, i) {
                d.id = `outlier-${i}`;
                d.hidden = mark.hidden;
                d3.select(this).classed(`hidden-${mark.hidden} ${d.id}`, true);
            })
            .on('mouseover', d => {
                this.svg.select(`.hidden-true.${d.id} circle`).attr({
                    'fill-opacity': 1,
                    'stroke-opacity': 1
                });
            })
            .on('mouseout', d => {
                this.svg.select(`.hidden-true.${d.id} circle`).attr({
                    'fill-opacity': 0,
                    'stroke-opacity': 0
                });
            });
    });
}
