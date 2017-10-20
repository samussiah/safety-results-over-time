export default function addBoxPlot(chart, group, boxInsideColor = '#eee', precision = 0) {
    //Make the numericResults numeric and sort.
    const numericResults = group.results.map(d => +d).sort(d3.ascending);
    const boxPlotWidth = 0.75 / chart.colorScale.domain().length;
    const boxColor = chart.colorScale(group.key);

    //Define x - and y - scales.
    const x = d3.scale.linear().range([0, chart.x.rangeBand()]);
    const y =
        chart.config.y.type === 'linear'
            ? d3.scale
                  .linear()
                  .range([chart.plot_height, 0])
                  .domain(chart.y.domain())
            : d3.scale
                  .log()
                  .range([chart.plot_height, 0])
                  .domain(chart.y.domain());

    //Define quantiles of interest.
    let probs = [0.05, 0.25, 0.5, 0.75, 0.95],
        iS;
    for (let i = 0; i < probs.length; i++) {
        probs[i] = d3.quantile(numericResults, probs[i]);
    }

    //Define box plot container.
    const boxplot = group.svg
        .append('g')
        .attr('class', 'boxplot')
        .datum({
            values: numericResults,
            probs: probs
        });
    const left = x(0.5 - boxPlotWidth / 2);
    const right = x(0.5 + boxPlotWidth / 2);

    //Draw box.
    boxplot
        .append('rect')
        .attr({
            class: 'boxplot fill',
            x: left,
            width: right - left,
            y: y(probs[3]),
            height: y(probs[1]) - y(probs[3])
        })
        .style('fill', boxColor);

    //Draw horizontal lines at 5th percentile, median, and 95th percentile.
    iS = [0, 2, 4];
    const iSclass = ['', 'median', ''];
    const iSColor = [boxColor, boxInsideColor, boxColor];
    for (let i = 0; i < iS.length; i++) {
        boxplot
            .append('line')
            .attr({
                class: 'boxplot ' + iSclass[i],
                x1: left,
                x2: right,
                y1: y(probs[iS[i]]),
                y2: y(probs[iS[i]])
            })
            .style({
                fill: iSColor[i],
                stroke: iSColor[i]
            });
    }

    //Draw vertical lines from the 5th percentile to the 25th percentile and from the 75th percentile to the 95th percentile.
    iS = [[0, 1], [3, 4]];
    for (var i = 0; i < iS.length; i++) {
        boxplot
            .append('line')
            .attr({
                class: 'boxplot',
                x1: x(0.5),
                x2: x(0.5),
                y1: y(probs[iS[i][0]]),
                y2: y(probs[iS[i][1]])
            })
            .style('stroke', boxColor);
    }

    //Draw outer circle.
    boxplot
        .append('circle')
        .attr({
            class: 'boxplot mean',
            cx: x(0.5),
            cy: y(d3.mean(numericResults)),
            r: x(boxPlotWidth / 3)
        })
        .style({
            fill: boxInsideColor,
            stroke: boxColor
        });

    //Draw inner circle.
    boxplot
        .append('circle')
        .attr({
            class: 'boxplot mean',
            cx: x(0.5),
            cy: y(d3.mean(numericResults)),
            r: x(boxPlotWidth / 6)
        })
        .style({
            fill: boxColor,
            stroke: 'none'
        });

    //Annotate statistics.
    const format0 = d3.format(`.${precision + 0}f`);
    const format1 = d3.format(`.${precision + 1}f`);
    const format2 = d3.format(`.${precision + 2}f`);
    boxplot
        .selectAll('.boxplot')
        .append('title')
        .text(
            d =>
                'N = ' +
                d.values.length +
                '\nMin = ' +
                d3.min(d.values) +
                '\n5th % = ' +
                format1(d3.quantile(d.values, 0.05)) +
                '\nQ1 = ' +
                format1(d3.quantile(d.values, 0.25)) +
                '\nMedian = ' +
                format1(d3.median(d.values)) +
                '\nQ3 = ' +
                format1(d3.quantile(d.values, 0.75)) +
                '\n95th % = ' +
                format1(d3.quantile(d.values, 0.95)) +
                '\nMax = ' +
                d3.max(d.values) +
                '\nMean = ' +
                format1(d3.mean(d.values)) +
                '\nStDev = ' +
                format2(d3.deviation(d.values))
        );
}
