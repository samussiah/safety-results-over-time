export default function addBoxplot
    (svg
    ,results
    ,height
    ,width
    ,domain
    ,boxPlotWidth
    ,boxColor
    ,boxInsideColor
    ,format = '.2f'
    ,horizontal = true) {

  //Make the numericResults numeric and sort.
    const numericResults = results
        .map(d => + d)
        .sort(d3.ascending);

  //Define x - and y - scales.
    const x = d3.scale.linear()
        .range([0, width])
    const y = d3.scale.linear()
        .range([height, 0])

    if (horizontal)
        y.domain(domain);
    else
        x.domain(domain);

  //Define quantiles of interest.
    let probs = [0.05,0.25,0.5,0.75,0.95],iS;
    for (let i = 0; i < probs.length; i ++) {
        probs[i] = d3.quantile(numericResults, probs[i]);
    }

  //Define box plot container.
    const boxplot = svg.append('g')
        .attr('class','boxplot')
        .datum(
            {values: numericResults
            ,probs: probs});

  //Define box dimensions.
    const left = horizontal
        ? 0.5 - boxPlotWidth/2
        : null;
    const right = horizontal
        ? 0.5 + boxPlotWidth/2
        : null;
    const top = horizontal
        ? null
        : 0.5 - boxPlotWidth/2;
    const bottom = horizontal
        ? null
        : 0.5 + boxPlotWidth/2;

  //Transform box dimensions.
    const box_x = horizontal
        ? x(left)
        : x(probs[1]);
    const box_width = horizontal
        ? x(right) - x(left)
        : x(probs[3]) - x(probs[1]);
    const box_y = horizontal
        ? y(probs[3])
        : y(right);
    const box_height = horizontal
        ? ( - y(probs[3]) + y(probs[1]))
        : y(left) - y(right);

  //Draw box.
    boxplot
        .append('rect')
        .attr(
            {'class': 'boxplot fill'
            ,'x': box_x
            ,'width': box_width
            ,'y': box_y
            ,'height': box_height})
        .style('fill', boxColor);

  //Draw horizontal lines at 5th percentile, median, and 95th percentile.
    iS = [0,2,4];
    const iSclass = ['','median',''];
    const iSColor = [boxColor, boxInsideColor, boxColor]
    for (let i = 0; i < iS.length; i ++) {
        boxplot
            .append('line')
            .attr(
                {'class': 'boxplot ' + iSclass[i]
                ,'x1': horizontal ? x(left)         : x(probs[iS[i]])
                ,'x2': horizontal ? x(right)        : x(probs[iS[i]])
                ,'y1': horizontal ? y(probs[iS[i]]) : y(left)
                ,'y2': horizontal ? y(probs[iS[i]]) : y(right)})
            .style(
                {'fill': iSColor[i]
                ,'stroke': iSColor[i]})
    }

  //Draw vertical lines from the 5th percentile to the 25th percentile and from the 75th percentile to the 95th percentile.
    iS = [[0,1],[3,4]];
    for (var i = 0; i < iS.length; i ++) {
        boxplot
            .append('line')
            .attr(
                {'class': 'boxplot'
                ,'x1': horizontal ? x(0.5)             : x(probs[iS[i][0]])
                ,'x2': horizontal ? x(0.5)             : x(probs[iS[i][1]])
                ,'y1': horizontal ? y(probs[iS[i][0]]) : y(0.5)
                ,'y2': horizontal ? y(probs[iS[i][1]]) : y(0.5)})
            .style('stroke', boxColor);
    }

  //Draw outer circle.
    boxplot
        .append('circle')
        .attr(
            {'class': 'boxplot mean'
            ,'cx': horizontal ? x(0.5)                     : x(d3.mean(numericResults))
            ,'cy': horizontal ? y(d3.mean(numericResults)) : y(0.5)
            ,'r' : horizontal ? x(boxPlotWidth/3)          : y(1 - boxPlotWidth/3)})
        .style(
            {'fill': boxInsideColor
            ,'stroke': boxColor});

  //Draw inner circle.
    boxplot
        .append('circle')
        .attr(
            {'class': 'boxplot mean'
            ,'cx': horizontal ? x(0.5)                     : x(d3.mean(numericResults))
            ,'cy': horizontal ? y(d3.mean(numericResults)) : y(0.5)
            ,'r' : horizontal ? x(boxPlotWidth/6)          : y(1 - boxPlotWidth/6)})
        .style(
            {'fill': boxColor
            ,'stroke': 'None'});

  //Annotate statistics.
    const xFormat = d3.format(format);
    boxplot.selectAll('.boxplot')
        .append('title')
        .text(d => 'N = ' + d.values.length
            + '\nMin = ' + d3.min(d.values)
            + '\n5th % = ' + xFormat(d3.quantile(d.values, 0.05))
            + '\nQ1 = ' + xFormat(d3.quantile(d.values, 0.25))
            + '\nMedian = ' + xFormat(d3.median(d.values))
            + '\nQ3 = ' + xFormat(d3.quantile(d.values, 0.75))
            + '\n95th % = ' + xFormat(d3.quantile(d.values, 0.95))
            + '\nMax = ' + d3.max(d.values)
            + '\nMean = ' + xFormat(d3.mean(d.values))
            + '\nStDev = ' + xFormat(d3.deviation(d.values)));
}
