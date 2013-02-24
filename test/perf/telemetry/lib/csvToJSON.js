"use strict";

var parseCSV = function(file, cb) {

	var fs     = require('fs')
	, filename = file
	, csv      = require('csv')
	; 

	var header = [];
	var values = [];
	var json   = {};

	csv()
	.from.stream(fs.createReadStream(file))
	.on('record', function(row,index){
		if (index === 0)
			header.push(row);
		else
			values.push(row);
	})
	.on('end', function(count){
		header[0].forEach(function (h, idx) {
			json[h] = values[0][idx];
		});
		cb(json);
	})
	.on('error', function(error){
		console.log(error.message);
	});
};

module.exports = parseCSV;