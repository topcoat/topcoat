var assert = require('assert');
var fs = require('fs');

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

describe('Topcoat Notification Base', function() {

    it('should create expected css file', function() {
        var actual = read('css/notification.css').trim();
        var expected = read('test/expected/notification.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
