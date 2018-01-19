import { set } from 'd3';

export default function removeUnscheduledVisits() {
    this.config.x.domain = this.config.x.order;

    //Remove visits without data.
    if (!this.config.visits_without_data)
        this.config.x.domain = this.config.x.domain.filter(
            visit =>
                set(this.filtered_measure_data.map(d => d[this.config.time_settings.value_col]))
                    .values()
                    .indexOf(visit) > -1
        );

    //Remove unscheduled visits.
    if (!this.config.unscheduled_visits)
        this.config.x.domain = this.config.x.domain.filter(
            visit => !this.config.unscheduled_visit_pattern.test(visit)
        );
}
