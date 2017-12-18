import babel from 'rollup-plugin-babel';

export default {
    name: 'safetyResultsOverTime',
    input: './src/wrapper.js',
    output:
        {file: './build/safetyResultsOverTime.js',
        format: 'umd'
    },
    globals: {
        d3: 'd3',
        webcharts: 'webCharts'
    },
    external: (function() {
        var dependencies = require('./package.json').dependencies;

        return Object.keys(dependencies);
    }()),
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['env',
                {'modules': false}
                ]
            ],
            plugins: [
                'external-helpers'
            ],
            babelrc: false
        })
    ]
}