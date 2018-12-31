export default function controlInputs() {
    return [
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
        {
            type: 'checkbox',
            inline: true,
            option: 'visits_without_data',
            label: 'Visits without data'
        },
        {
            type: 'checkbox',
            inline: true,
            option: 'unscheduled_visits',
            label: 'Unscheduled visits'
        },
        { type: 'checkbox', inline: true, option: 'boxplots', label: 'Box plots' },
        { type: 'checkbox', inline: true, option: 'violins', label: 'Violin plots' },
        { type: 'checkbox', inline: true, option: 'outliers', label: 'Outliers' },
        { type: 'radio', option: 'y.type', values: ['linear', 'log'], label: 'Axis type' }
    ];
}
