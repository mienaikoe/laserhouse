const makerjs = require('makerjs');

const root = document.getElementById("root");

var line = { 
  type: 'line', 
  origin: [0, 0], 
  end: [50, 50] 
 };
 
var svg = makerjs.exporter.toSVG(line);

document.write(svg);
