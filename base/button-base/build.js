var fs = require("fs");
var rework = require('rework');
var reworkInherit = require('rework-inherit');
var reworkNPM = require('rework-npm');

var css = fs.readFileSync('./test/fixtures/button.css', 'utf-8');
// console.log(css);

var output = rework(css)
  .use(reworkNPM())
  .use(reworkInherit())
  .toString();

console.log(output);
