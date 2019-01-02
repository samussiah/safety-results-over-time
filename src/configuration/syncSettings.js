export default function syncSettings(settings) {
    //groups
    const defaultGroup = [{ value_col: 'srot_none', label: 'None' }];
    if (!(settings.groups instanceof Array && settings.groups.length)) {
        settings.groups = defaultGroup;
    } else {
        settings.groups = defaultGroup.concat(
            settings.groups.map(group => {
                return {
                    value_col: group.value_col || group,
                    label: group.label || group.value_col || group
                };
            })
        );
    }

    //x-axis
    settings.x.column = settings.time_settings.value_col;
    settings.x.label = settings.time_settings.label;
    settings.x.behavior = settings.visits_without_data ? 'raw' : 'flex';

    //y-axis
    settings.y.column = settings.value_col;

    //stratification
    settings.color_by =
        settings.groups.length > 1 ? settings.groups[1].value_col : settings.groups[0].value_col;

    //marks
    settings.marks[0].per = [settings.color_by];
    settings.marks[1].per = [settings.id_col, settings.time_settings.value_col, settings.value_col];
    settings.marks[1].tooltip = `[${settings.id_col}] at [${settings.x.column}]: $y`;

    //margin
    settings.margin = settings.margin || { bottom: settings.time_settings.vertical_space };

    //Convert unscheduled_visit_pattern from string to regular expression.
    if (
        typeof settings.unscheduled_visit_pattern === 'string' &&
        settings.unscheduled_visit_pattern !== ''
    ) {
        const flags = settings.unscheduled_visit_pattern.replace(/.*?\/([gimy]*)$/, '$1'),
            pattern = settings.unscheduled_visit_pattern.replace(
                new RegExp('^/(.*?)/' + flags + '$'),
                '$1'
            );
        settings.unscheduled_visit_regex = new RegExp(pattern, flags);
    }

    return settings;
}
