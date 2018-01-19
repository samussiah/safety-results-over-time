const defaultSettings = {
    //Custom settings for this template
    id_col: 'USUBJID',
    time_settings: {
        value_col: 'VISIT',
        label: 'Visit',
        order_col: 'VISITNUM',
        order: null,
        rotate_tick_labels: true,
        vertical_space: 100
    },
    measure_col: 'TEST',
    value_col: 'STRESN',
    unit_col: 'STRESU',
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    start_value: null,
    filters: null,
    groups: null,
    boxplots: true,
    violins: false,
    missingValues: ['', 'NA', 'N/A'],
    visits_without_data: false,
    unscheduled_visits: false,
    unscheduled_visit_pattern: /unscheduled|early termination/i,

    //Standard webcharts settings
    x: {
        column: null, // set in syncSettings()
        type: 'ordinal',
        label: null,
        behavior: 'flex',
        sort: 'alphabetical-ascending',
        tickAttr: null
    },
    y: {
        column: null, // set in syncSettings()
        type: 'linear',
        label: null,
        behavior: 'flex',
        stat: 'mean',
        format: '0.2f'
    },
    marks: [
        {
            type: 'line',
            per: null, // set in syncSettings()
            attributes: {
                'stroke-width': 2,
                'stroke-opacity': 1,
                display: 'none'
            }
        }
    ],
    legend: {
        mark: 'square'
    },
    color_by: null, // set in syncSettings()
    resizable: true,
    gridlines: 'y',
    aspect: 3
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    settings.x.column = settings.time_settings.value_col;
    settings.x.label = settings.time_settings.label;
    settings.x.behavior = settings.visits_without_data ? 'raw' : 'flex';
    settings.y.column = settings.value_col;
    if (!(settings.groups instanceof Array && settings.groups.length))
        settings.groups = [{ value_col: 'NONE', label: 'None' }];
    else
        settings.groups = settings.groups.map(group => {
            return {
                value_col: group.value_col || group,
                label: group.label || group.value_col || group
            };
        });
    settings.color_by = settings.groups[0].value_col
        ? settings.groups[0].value_col
        : settings.groups[0];
    settings.marks[0].per = [settings.color_by];
    settings.margin = settings.margin || { bottom: settings.time_settings.vertical_space };

    return settings;
}

// Default Control objects
export const controlInputs = [
    {
        type: 'subsetter',
        label: 'Measure',
        description: 'filter',
        value_col: null, // set in syncControlInputs()
        start: null // set in syncControlInputs()
    },
    {
        type: 'dropdown',
        label: 'Group',
        description: 'stratification',
        options: ['marks.0.per.0', 'color_by'],
        start: null, // set in syncControlInputs()
        values: ['NONE'], // set in syncControlInputs()
        require: true
    },
    { type: 'number', label: 'Lower Limit', option: 'y.domain[0]', require: true },
    { type: 'number', label: 'Upper Limit', option: 'y.domain[1]', require: true },
    { type: 'checkbox', inline: true, option: 'visits_without_data', label: 'Visits without data' },
    { type: 'checkbox', inline: true, option: 'unscheduled_visits', label: 'Unscheduled visits' },
    { type: 'checkbox', inline: true, option: 'boxplots', label: 'Box plots' },
    { type: 'checkbox', inline: true, option: 'violins', label: 'Violin plots' }
];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings) {
    const measureControl = controlInputs.filter(
            controlInput => controlInput.label === 'Measure'
        )[0],
        groupControl = controlInputs.filter(controlInput => controlInput.label === 'Group')[0];

    //Sync measure control.
    measureControl.value_col = settings.measure_col;
    measureControl.start = settings.start_value;

    //Sync group control.
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

    return controlInputs;
}

export default defaultSettings;
