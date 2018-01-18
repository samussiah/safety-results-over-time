export default function removeUnscheduledVisits() {
    this.config.x.domain = this.config.unscheduled_visits
        ? this.config.x.order
        : this.config.x.order.filter(visit => !this.config.unscheduled_visit_pattern.test(visit));
}
