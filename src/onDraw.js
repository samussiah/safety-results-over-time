import { ascending, nest } from 'd3';
import updateParticipantCount from './onDraw/updateParticipantCount';

export default function onDraw() {
    //Annotate population count.
    updateParticipantCount(this, '#populationCount');
}
