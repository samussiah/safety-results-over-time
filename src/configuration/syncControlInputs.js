export default function syncControlInputs(controlInputs, settings) {
    //Sync measure control.
    const measureControl = controlInputs.filter(
        controlInput => controlInput.label === 'Measure'
    )[0];
    measureControl.value_col = settings.measure_col;
    measureControl.start = settings.start_value;

    //Sync group control.
    const groupControl = controlInputs.filter(controlInput => controlInput.label === 'Group')[0];
    groupControl.start = settings.color_by;
    settings.groups.filter(group => group.value_col !== 'NONE').forEach(group => {
        groupControl.values.push(group.value_col);
    });

    //Add custom filters to control inputs.
    if (settings.filters) {
        settings.filters.reverse().forEach(function(filter) {
            const thisFilter = {
                type: 'subsetter',
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter,
                description: 'filter'
            };

            //add the filter to the control inputs (as long as it's not already there)
            var current_value_cols = controlInputs
                .filter(f => f.type == 'subsetter')
                .map(m => m.value_col);
            if (current_value_cols.indexOf(thisFilter.value_col) == -1)
                controlInputs.splice(1, 0, thisFilter);
        });
    }

    //Remove unscheduled visit control if unscheduled visit pattern is unscpecified.
    if (!settings.unscheduled_visit_regex)
        controlInputs.splice(
            controlInputs.map(controlInput => controlInput.label).indexOf('Unscheduled visits'),
            1
        );

    return controlInputs;
}
