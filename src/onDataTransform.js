import removeUnscheduledVisits from './onDataTransform/removeUnscheduledVisits';

export default function onDataTransform() {
    //Remove unscheduled visits from current_data array.
    removeUnscheduledVisits.call(this);
}
