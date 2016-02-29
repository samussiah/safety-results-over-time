import { ascending, nest, set, quantile } from 'd3';

export default function onDraw(){
  this.marks[0].data.forEach(e => {
      e.values.sort((a,b) => {
          return a.key === 'NA' ? 1 : b.key === 'NA' ? -1 : ascending(a.key, b.key);
      });
  });

  var sortVar = this.config.x.column;

  // Make nested data set for boxplots
  this.nested_data = nest()
      .key(d => d[this.config.x.column])
      .key(d => d[this.config.marks[0].per[0]])
      .rollup(d => {
        return d.map(m => +m[this.config.y.column]);
      })
      .entries(this.filtered_data);

  // y-domain for box plots
  var y_05s = [];
  var y_95s = [];
  this.nested_data.forEach(function(e){
      e.values.forEach(function(v,i){
        var results = v.values
          .sort(ascending);
          y_05s.push(quantile(results, 0.05));
          y_95s.push(quantile(results, 0.95));
      });
  });
  this.y_dom[0] = Math.min.apply(null, y_05s);
  this.y_dom[1] = Math.max.apply(null, y_95s);

  // x domain
  /*
  var visits = set( this.filtered_data.map(m => m[this.config.x.column] ) )
    .values()
    .sort(function(a,b){
      return a === 'NA' ? 1 : b === 'NA' ? -1 : ascending(+a, +b);
    });
console.log(visits)
  this.config.x_dom = visits;
*/
}