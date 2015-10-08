var assert = require('assert');
var fs = require('fs');

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

describe('Topcoat input base', function() {
    'use strict';

    it('should create expected css file', function() {
        var actual = read('css/input.css').trim();
        var expected = read('test/expected/input.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
