d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/ADBDS.csv',
    function(d,i) {
        return d;
    },
    function(error,data) {
        if (error)
            console.log(error);

        var settings = {
            groups: [
                {value_col: 'SEX', label: 'Sex'},
                {value_col: 'ARM', label: 'Treatment Group'},
                {value_col: 'RACE', label: 'Race'},
                {value_col: 'SITEID', label: 'Site'},
                {value_col: 'SITEID', label: 'asdf'}, // duplicate variable
                'None' // nonexistent variable
            ],
            color_by: 'ARM',
        };
        var instance = safetyResultsOverTime(
            '#container',
            settings
        );
        instance.init(data);
    }
);
