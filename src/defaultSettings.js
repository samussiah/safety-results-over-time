const defaultSettings = {
  //Custom settings for this template
    id_col: 'USUBJID',
    time_settings: {
        value_col: 'VISITN',
        label: 'Visit Number',
        order: null, // x-axis domain order (array)
        rotate_tick_labels: false,
        vertical_space: 0},
    measure_col: 'TEST',
    value_col: 'STRESN',
    unit_col: 'STRESU',
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    start_value: null,
    groups: [
        {value_col: 'NONE', label: 'None'}
    ],
    filters: null,
    boxplots: true,
    violins: false,
    missingValues: ['', 'NA', 'N/A'],

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
                'display': 'none'
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
    settings.x.order = settings.time_settings.order;
    settings.y.column = settings.value_col;
    if (settings.groups)
        settings.color_by = settings.groups[0].value_col
            ? settings.groups[0].value_col
            : settings.groups[0];
    else
        settings.color_by = 'NONE';
    settings.marks[0].per = [settings.color_by];
    settings.margin = settings.margin || {bottom: settings.time_settings.vertical_space};

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
        options: ['marks.0.per.0','color_by'],
        start: null, // set in syncControlInputs()
        values: null, // set in syncControlInputs()
        require: true
    },
    {
        type: 'radio',
        label: 'Y-axis scale:',
        option: 'y.type',
        values: ['linear','log'], // set in syncControlInputs()
        relabels: ['Linear','Log'],
        require: true
    },
    {
        type: 'radio',
        label: 'Hide visits with no data:',
        option: 'x.behavior',
        values: ['flex','raw'],
        relabels: ['Yes','No'],
        require: true
    },
    {type: 'checkbox', option: 'boxplots', label: 'Box plots', inline: true},
    {type: 'checkbox', option: 'violins', label: 'Violin plots', inline: true}];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings) {
  //Sync measure control.
    let measureControl = controlInputs
        .filter(controlInput => controlInput.label === 'Measure')[0];
    measureControl.value_col = settings.measure_col;
    measureControl.start = settings.start_value;

  //Sync group control.
    let groupControl = controlInputs
        .filter(controlInput => controlInput.label === 'Group')[0];
    groupControl.start = settings.color_by;
    if (settings.groups)
        groupControl.values = settings.groups
            .map(group => group.value_col
                ? group.value_col
                : group);

  //Add custom filters to control inputs.
    if (settings.filters)
        settings.filters
            .reverse()
            .forEach(filter =>
                controlInputs.splice(1, 0,
                    {type: 'subsetter'
                    ,value_col: filter.value_col ? filter.value_col : filter
                    ,label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
                    ,description: 'filter'}));

    return controlInputs
}

export default defaultSettings;
