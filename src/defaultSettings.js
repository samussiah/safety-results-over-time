const defaultSettings = {
  //Custom settings for this template
    id_col: 'USUBJID',
    time_col: 'VISITN',
    measure_col: 'TEST',
    value_col: 'STRESN',
    unit_col: 'STRESU',
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    start_value: null,
    groups: [
        {value_col: 'NONE', label: 'None'},
        {value_col: 'SEX', label: 'Sex'},
        {value_col: 'RACE', label: 'Race'}
    ],
    filters: null,
    boxplots: true,
    violins: false,
    rotateX: true,
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
        label: ''
    },
    color_by: null, // set in syncSettings()
    resizable: false,
    gridlines: 'xy',
    aspect: 3
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    settings.x.column = settings.time_col;
    settings.y.column = settings.value_col;
    if (settings.groups)
        settings.color_by = settings.groups[0].value_col
            ? settings.groups[0].value_col
            : settings.groups[0];
    else
        settings.color_by = 'NONE';
    settings.marks[0].per = [settings.color_by];

    return settings;
}

// Default Control objects
export const controlInputs = [
      {
        type: 'subsetter',
        label: 'Measure',
        value_col: null, // set in syncControlInputs()
        start: null // set in syncControlInputs()
    },
    {
        type: 'dropdown',
        label: 'Group',
        options: ['marks.0.per.0','color_by'],
        start: null, // set in syncControlInputs()
        values: null, // set in syncControlInputs()
        require: true
    },
    {
        type: 'radio',
        label: 'Hide visits with no data: ',
        option: 'x.behavior',
        values: ['flex','raw'],
        relabels: ['Yes','No'],
        require: true
    },
    {type: 'checkbox', option: 'boxplots', label: 'Box Plots', inline: true},
    {type: 'checkbox', option: 'violins', label: 'Violin Plots', inline: true}];

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
                controlInputs.splice(2, 0,
                    {type: 'subsetter'
                    ,value_col: filter.value_col ? filter.value_col : filter
                    ,label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter}));

    return controlInputs
}

export default defaultSettings;
