d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/ADBDS.csv',
    function(d,i) {
        return d;
    },
    function(error,data) {
        if (error)
            console.log(error);

        var settings = {
            groups: ['SEX', 'ARM', 'RACE', 'SITEID']
                .map(group => {
                    return {
                        value_col: group,
                        label: (group.substring(0,1).toUpperCase() + group.substring(1).toLowerCase())
                            .replace('Siteid', 'Site ID'),
                    };
                }),
        };
        var instance = safetyResultsOverTime(
            '#container',
            settings
        );
        instance.init(data);
    }
);
