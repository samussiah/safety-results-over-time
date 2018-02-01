import countParticipants from './onInit/countParticipants';
import cleanData from './onInit/cleanData';
import addVariables from './onInit/addVariables';
import defineVisitOrder from './onInit/defineVisitOrder';
import checkFilters from './onInit/checkFilters';
import setInitialMeasure from './onInit/setInitialMeasure';

export default function onInit() {
    //Count total participants prior to data cleaning.
    countParticipants.call(this);

    //Drop missing values and remove measures with any non-numeric results.
    cleanData.call(this);

    //Define additional variables.
    addVariables.call(this);

    //Define ordered x-axis domain with visit order variable.
    defineVisitOrder.call(this);

    //Remove filters for nonexistent or single-level variables.
    checkFilters.call(this);

    //Choose the start value for the Test filter
    setInitialMeasure.call(this);
}
