d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    function(d) {
        return d;
    },
    function(data) {
        const measures = [...new Set(data.map(d => d.TEST)).values()]
            .sort(webCharts.dataOps.naturalSorter)
            .reverse();
        data.forEach(d => {
            d.TESTN = measures.findIndex(measure => measure === d.TEST);
        });

        const instance = safetyResultsOverTime(
            '#container', // element
            {
                filters: [
                    {value_col: 'SEX', label: 'Sex', all: false, start: 'M'},
                    {value_col: 'ARM', label: 'Treatment Group'},
                    {value_col: 'RACE', label: 'Race'},
                    {value_col: 'SITEID', label: 'Site'},
                ],
                groups: [
                    {value_col: 'SEX', label: 'Sex'},
                    {value_col: 'ARM', label: 'Treatment Group'},
                    {value_col: 'RACE', label: 'Race'},
                    {value_col: 'SITEID', label: 'Site'},
                ],
                color_by: 'ARM',
            } // settings
        );
        instance.init(data);
    }
);
