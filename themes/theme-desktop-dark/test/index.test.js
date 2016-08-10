var assert = require('assert');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

describe('Topcoat theme-desktop-dark', function() {
  it('should create expected css file', function() {
    var actual = read('css/theme-desktop-dark.css');
    var expected = read('test/expected/theme-desktop-dark.css');
    assert.equal(actual, expected, 'should generate correct css');
  });
});
