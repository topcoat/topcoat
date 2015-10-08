var assert = require('assert');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

describe('button-bar-base', function() {
  'use strict';
  it('should create expected css file', function() {
    var actual = read('css/button-bar.css').trim();
    var expected = read('test/expected/button-bar.css').trim();
    assert.equal(actual, expected, 'should generate correct css');
  });
});
