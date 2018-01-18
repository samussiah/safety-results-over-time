export default function removeUnscheduledVisits() {
    if (this.config.unscheduled_visit_regex && !this.config.unscheduled_visits)
        this.config.x.domain = this.config.x.order.filter(
            visit => !this.config.unscheduled_visit_regex.test(visit)
        );
    else this.config.x.domain = this.config.x.order;
}
