import updateParticipantCount from './onDraw/updateParticipantCount';

export default function onDraw() {
    updateParticipantCount.call(this);
}
