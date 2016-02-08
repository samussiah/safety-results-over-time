module.exports = {
  entry: './src/index.js',
  format: 'iife',
  globals: {
    webcharts: 'webCharts',
    d3: 'd3'
  },
  dest: 'results-over-time.js',
  moduleName: 'resultsOverTime'
}; 