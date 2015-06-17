var fs = require("fs");
var postcss = require('postcss');
var cssVariables = require('postcss-css-variables');
var simpleExtend = require('postcss-simple-extend');
var atImport = require("postcss-import")

var inputCss = fs.readFileSync('./test/fixtures/button.css', 'utf-8');
// console.log(css);

var outputCss = postcss()
  .use(simpleExtend())
  .process(inputCss)
  .css;

console.log(outputCss);
