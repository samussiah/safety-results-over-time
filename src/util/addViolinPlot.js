export default function addViolin(chart,group
    ,violinColor = '#ccc7d6'
    ,precision = 0) {

  //Define histogram data.
    const histogram = d3.layout.histogram().bins(10).frequency(0);
    const data = histogram(group.results);
    data.unshift(
        {x: d3.min(group.results)
        ,dx: 0
        ,y: data[0].y});
    data.push(
        {x: d3.max(group.results)
        ,dx: 0
        ,y: data[data.length - 1].y});

  //Define plot properties.
    const width = chart.x.rangeBand();
    const x = d3.scale.linear()
        .domain(chart.y.domain())
        .range([chart.plot_height,0]);
    const y = d3.scale.linear()
        .domain([0, Math.max(1 - 1/group.x.nGroups, d3.max(data, d => d.y))])
        .range([width/2, 0]);

  //Define violin shapes.
    const area = d3.svg.area()
        .interpolate('basis')
        .x(d => x(d.x + d.dx/2))
        .y0(width/2)
        .y1(d => y(d.y));
    const line = d3.svg.line()
        .interpolate('basis')
        .x(d => x(d.x + d.dx/2))
        .y(d => y(d.y));

  //Define left half of violin plot.
    const gMinus = group.svg.append('g')
        .attr('transform', 'rotate(90,0,0) scale(1,-1)');
    gMinus.append('path')
        .datum(data)
        .attr(
            {'class': 'area'
            ,'d': area
            ,'fill': violinColor
            ,'fill-opacity': .75});
    gMinus.append('path')
        .datum(data)
        .attr(
            {'class': 'violin'
            ,'d': line
            ,'stroke': violinColor
            ,'fill': 'none'});

  //Define right half of violin plot.
    const gPlus = group.svg.append('g')
        .attr('transform', 'rotate(90,0,0) translate(0,-' + width + ')');
    gPlus.append('path')
        .datum(data)
        .attr(
            {'class': 'area'
            ,'d': area
            ,'fill': violinColor
            ,'fill-opacity': .75});
    gPlus.append('path')
        .datum(data)
        .attr(
            {'class': 'violin'
            ,'d': line
            ,'stroke': violinColor
            ,'fill': 'none'});

  //Annotate statistics.
    const format0 = d3.format(`.${precision + 0}f`);
    const format1 = d3.format(`.${precision + 1}f`);
    const format2 = d3.format(`.${precision + 2}f`);
    group.svg.selectAll('g')
        .append('title')
        .text(d => 'N = ' + group.results.length
            + '\nMin = ' + d3.min(group.results)
            + '\n5th % = ' + format1(d3.quantile(group.results, 0.05))
            + '\nQ1 = ' + format1(d3.quantile(group.results, 0.25))
            + '\nMedian = ' + format1(d3.median(group.results))
            + '\nQ3 = ' + format1(d3.quantile(group.results, 0.75))
            + '\n95th % = ' + format1(d3.quantile(group.results, 0.95))
            + '\nMax = ' + d3.max(group.results)
            + '\nMean = ' + format1(d3.mean(group.results))
            + '\nStDev = ' + format2(d3.deviation(group.results)));
}
