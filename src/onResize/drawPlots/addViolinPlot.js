import { layout, min, max, scale, svg } from 'd3';

export default function addViolinPlot(chart, subgroup, violinColor = '#ccc7d6') {
    //Define histogram data.
    const histogram = layout
        .histogram()
        .bins(10)
        .frequency(0);
    const data = histogram(subgroup.results);
    data.unshift({
        x: min(subgroup.results),
        dx: 0,
        y: data[0].y
    });
    data.push({
        x: max(subgroup.results),
        dx: 0,
        y: data[data.length - 1].y
    });

    //Define plot properties.
    const width = chart.x.rangeBand();
    const x =
        chart.config.y.type === 'linear'
            ? scale
                  .linear()
                  .domain(chart.y.domain())
                  .range([chart.plot_height, 0])
            : scale
                  .log()
                  .domain(chart.y.domain())
                  .range([chart.plot_height, 0]);
    const y = scale
        .linear()
        .domain([0, Math.max(1 - 1 / subgroup.group.x.nGroups, max(data, d => d.y))])
        .range([width / 2, 0]);

    //Define violin shapes.
    const area = svg
        .area()
        .interpolate('basis')
        .x(d => x(d.x + d.dx / 2))
        .y0(width / 2)
        .y1(d => y(d.y));
    const line = svg
        .line()
        .interpolate('basis')
        .x(d => x(d.x + d.dx / 2))
        .y(d => y(d.y));
    const violinplot = subgroup.svg
        .append('g')
        .attr('class', 'violinplot')
        .attr('clip-path', `url(#${chart.id})`);

    //Define left half of violin plot.
    const gMinus = violinplot.append('g').attr('transform', 'rotate(90,0,0) scale(1,-1)');
    gMinus
        .append('path')
        .datum(data)
        .attr({
            class: 'area',
            d: area,
            fill: violinColor,
            'fill-opacity': 0.75
        });
    gMinus
        .append('path')
        .datum(data)
        .attr({
            class: 'violin',
            d: line,
            stroke: violinColor,
            fill: 'none'
        });

    //Define right half of violin plot.
    const gPlus = violinplot
        .append('g')
        .attr('transform', 'rotate(90,0,0) translate(0,-' + width + ')');
    gPlus
        .append('path')
        .datum(data)
        .attr({
            class: 'area',
            d: area,
            fill: violinColor,
            'fill-opacity': 0.75
        });
    gPlus
        .append('path')
        .datum(data)
        .attr({
            class: 'violin',
            d: line,
            stroke: violinColor,
            fill: 'none'
        });
}
