import updateParticipantCount from './onDraw/updateParticipantCount';
import removeUnscheduledVisits from './onDraw/removeUnscheduledVisits';
import removeYAxisTicks from './onDraw/removeYAxisTicks';

export default function onDraw() {
    updateParticipantCount.call(this);
    removeUnscheduledVisits.call(this);
    removeYAxisTicks.call(this);
}
