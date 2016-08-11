var assert = require('assert');
var fs = require('fs');

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

describe('Topcoat Button Base', function() {
    'use strict';

    it('should create expected css file', function() {
        console.log(require('../package.json').name)
        var actual = read('css/index.css').trim();
        var expected = read('test/expected/index.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
