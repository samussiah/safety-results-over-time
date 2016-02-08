var fs = require('fs');
var rollup = require('rollup');

rollup.rollup({
	entry: './cf-wrapper/Renderer.js'
})
.then( function ( bundle ) {
	var result = bundle.generate({
	  format: 'cjs',
	  globals: {
	    webcharts: 'webCharts',
	    d3: 'd3',
	    react: 'React'
	  },
	  dest: 'cf-results-over-time.common.js'
	});
	console.log('bundled!')
	fs.writeFileSync( 'cf-results-over-time.common.js', result.code );
})
.catch( function (error) {
	console.log(error);
});