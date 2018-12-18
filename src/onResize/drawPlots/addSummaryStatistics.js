import { format, min, quantile, median, max, mean, deviation } from 'd3';

export default function addSummaryStatistics(subgroup, precision = 0) {
    const format0 = format(`.${precision + 0}f`);
    const format1 = format(`.${precision + 1}f`);
    const format2 = format(`.${precision + 2}f`);
    subgroup.svg
        .selectAll('g')
        .append('title')
        .text(
            d =>
                'N = ' +
                subgroup.results.length +
                '\nMin = ' +
                min(subgroup.results) +
                '\n5th % = ' +
                format1(quantile(subgroup.results, 0.05)) +
                '\nQ1 = ' +
                format1(quantile(subgroup.results, 0.25)) +
                '\nMedian = ' +
                format1(median(subgroup.results)) +
                '\nQ3 = ' +
                format1(quantile(subgroup.results, 0.75)) +
                '\n95th % = ' +
                format1(quantile(subgroup.results, 0.95)) +
                '\nMax = ' +
                max(subgroup.results) +
                '\nMean = ' +
                format1(mean(subgroup.results)) +
                '\nStDev = ' +
                format2(deviation(subgroup.results))
        );

    //Annotate statistics.
    //const format0 = format(`.${precision + 0}f`);
    //const format1 = format(`.${precision + 1}f`);
    //const format2 = format(`.${precision + 2}f`);
    //boxplot
    //    .selectAll('.boxplot')
    //    .append('title')
    //    .text(
    //        d =>
    //            'N = ' +
    //            d.values.length +
    //            '\nMin = ' +
    //            min(d.values) +
    //            '\n5th % = ' +
    //            format1(quantile(d.values, 0.05)) +
    //            '\nQ1 = ' +
    //            format1(quantile(d.values, 0.25)) +
    //            '\nMedian = ' +
    //            format1(median(d.values)) +
    //            '\nQ3 = ' +
    //            format1(quantile(d.values, 0.75)) +
    //            '\n95th % = ' +
    //            format1(quantile(d.values, 0.95)) +
    //            '\nMax = ' +
    //            max(d.values) +
    //            '\nMean = ' +
    //            format1(mean(d.values)) +
    //            '\nStDev = ' +
    //            format2(deviation(d.values))
    //    );
}
