import removeUnscheduledVisits from './onDataTransform/removeUnscheduledVisits';

export default function onDatatransform() {
    //Remove unscheduled visits from current_data array.
    removeUnscheduledVisits.call(this);
}
