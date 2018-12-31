import updateParticipantCount from './onDraw/updateParticipantCount';
import removeUnscheduledVisits from './onDraw/removeUnscheduledVisits';

export default function onDraw() {
    updateParticipantCount.call(this);
    removeUnscheduledVisits.call(this);
    this.svg.selectAll('.y.axis .tick').remove();
}
