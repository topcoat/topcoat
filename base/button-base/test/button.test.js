var assert = require('assert');

describe('button-bar-base', function() {
    'use strict';

    it('should create expected css file', function() {
        var actual = fs.createReadStream('css/button.css').trim();
        var expected = fs.createReadStream('test/expected/button.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
