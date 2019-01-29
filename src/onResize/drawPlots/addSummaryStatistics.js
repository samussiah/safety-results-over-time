import { format, min, quantile, median, max, mean, deviation } from 'd3';

export default function addSummaryStatistics(subgroup) {
    const format0 = format(`.${this.config.y.precision + 0}f`);
    const format1 = format(`.${this.config.y.precision + 1}f`);
    const format2 = format(`.${this.config.y.precision + 2}f`);
    subgroup.svg
        .selectAll('g')
        .append('title')
        .html(
            d =>
                `${subgroup.key} at ${subgroup.group.x.key}:\n&nbsp;&nbsp;&nbsp;&nbsp;N = ${subgroup
                    .results.length}\n&nbsp;&nbsp;&nbsp;&nbsp;Min = ${format0(
                    min(subgroup.results)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;5th % = ${format1(
                    quantile(subgroup.results, 0.05)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;Q1 = ${format1(
                    quantile(subgroup.results, 0.25)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;Median = ${format1(
                    median(subgroup.results)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;Q3 = ${format1(
                    quantile(subgroup.results, 0.75)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;95th % = ${format1(
                    quantile(subgroup.results, 0.95)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;Max = ${format0(
                    max(subgroup.results)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;Mean = ${format1(
                    mean(subgroup.results)
                )}\n&nbsp;&nbsp;&nbsp;&nbsp;StDev = ${format2(deviation(subgroup.results))}`
        );
}
