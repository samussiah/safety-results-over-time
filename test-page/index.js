d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/ADBDS.csv',
    function(d,i) {
        return d;
    },
    function(error,data) {
        if (error)
            console.log(error);

        var settings = {
            filters: ['ARM', 'SEX', 'RACE', 'SITEID'].reverse(),
            groups: ['ARM', 'SEX', 'RACE', 'SITEID'],
            start_value: 'Aminotransferase, alanine (ALT) (pkat/L)',
        };
        var instance = safetyResultsOverTime(
            '#container',
            settings
        );
        instance.init(data);
    }
);
