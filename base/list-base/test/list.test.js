var assert = require('assert');
var fs = require('fs');

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

describe('Topcoat list base', function() {
    'use strict';

    it('should create expected css file', function() {
        var actual = read('css/list.css').trim();
        var expected = read('test/expected/list.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
