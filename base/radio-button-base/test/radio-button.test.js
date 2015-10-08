var assert = require('assert');
var fs = require('fs');

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

describe('Topcoat Radio Button Base', function() {
    'use strict';

    it('should create expected css file', function() {
        var actual = read('css/radio-button.css').trim();
        var expected = read('test/expected/radio-button.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
