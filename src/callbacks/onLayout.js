import classControlGroups from './onLayout/classControlGroups';
import customizeGroupControl from './onLayout/customizeGroupControl';
import addResetButton from './onLayout/addResetButton';
import addPopulationCountContainer from './onLayout/addPopulationCountContainer';

export default function onLayout() {
    classControlGroups.call(this);
    customizeGroupControl.call(this);
    addResetButton.call(this);
    addPopulationCountContainer.call(this);
}
