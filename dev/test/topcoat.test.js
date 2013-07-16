'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.variableTest = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  stylus: function(test) {

    var files = grunt.file.expand('css/topcoat-*.min.css'),
        l = files.length
    ;

    test.expect(l);

    files.forEach(function (file) {
      var actual = grunt.file.read(file);
      var match = actual.match(/var-[a-z\-]*[a-z]+/g);

      if (match) console.log('\nMissing ' + match.join(', ') + ' in ' + file);
      test.equal(match, null, 'should not have missing vars');

    });

    test.done();

  }
};
