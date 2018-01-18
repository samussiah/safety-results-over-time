import getCurrentMeasure from './onPreprocess/getCurrentMeasure';
import defineMeasureData from './onPreprocess/defineMeasureData';
import removeUnscheduledVisits from './onPreprocess/removeUnscheduledVisits';
import setYdomain from './onPreprocess/setYdomain';
import updateYaxisLimitControls from './onPreprocess/updateYaxisLimitControls';
import setYaxisLabel from './onPreprocess/setYaxisLabel';
import setLegendLabel from './onPreprocess/setLegendLabel';
import updateYaxisResetButton from './onPreprocess/updateYaxisResetButton';

export default function onPreprocess() {
    // 1. Capture currently selected measure.
    getCurrentMeasure.call(this);

    // 2. Filter data on currently selected measure.
    defineMeasureData.call(this);

    // 3a Set y-domain given currently selected measure, update y-axis limit controls accordingly.
    setYdomain.call(this);

    // 3b Set y-axis label to current measure.
    setYaxisLabel.call(this);

    // 4a Update y-axis reset button when measure changes.
    updateYaxisResetButton.call(this);

    // 4b Update y-axis limit controls to match y-axis domain.
    updateYaxisLimitControls.call(this);

    //Remove unscheduled visits from x-axis domain.
    removeUnscheduledVisits.call(this);

    //Set legend label to current group.
    setLegendLabel.call(this);
}
