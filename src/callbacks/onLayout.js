import classControlGroups from './onLayout/classControlGroups';
import removeGroupControl from './onLayout/removeGroupControl';
import addResetButton from './onLayout/addResetButton';
import addPopulationCountContainer from './onLayout/addPopulationCountContainer';

export default function onLayout() {
    classControlGroups.call(this);
    removeGroupControl.call(this);
    addResetButton.call(this);
    addPopulationCountContainer.call(this);
}
