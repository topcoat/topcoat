var fs = require("fs");
var postcss = require('postcss');
var inherit = require('postcss-inherit');
var atImport = require("postcss-import");

var css = fs.readFileSync('./test/fixtures/button.css', 'utf-8');
// console.log(css);

var output = postcss()
  .use(atImport())
  .process(css, {})
  .css;

var newOutput = postcss()
  .use(inherit())
  .process(output, {})
  .css;


console.log(newOutput);
