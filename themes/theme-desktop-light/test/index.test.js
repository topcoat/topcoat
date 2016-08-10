var assert = require('assert');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

describe('Topcoat theme-desktop-light', function() {
  it('should create expected css file', function() {
    var actual = read('test/results/index.css');
    var expected = read('test/expected/index.css');
    assert.equal(actual, expected, 'should generate correct css');
  });
});
