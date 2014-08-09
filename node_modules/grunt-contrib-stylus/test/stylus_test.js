var grunt = require('grunt');
var fs = require('fs');

function readFile(file) {
  'use strict';

  var contents = grunt.file.read(file);

  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }

  return contents;
}

exports.stylus = {
  compile: function(test) {
    'use strict';

    test.expect(2);

    var actual = readFile('tmp/stylus.css');
    var expected = readFile('test/expected/stylus.css');
    test.equal(expected, actual, 'should compile stylus to css, handling includes and compression');

    actual = readFile('tmp/concat.css');
    expected = readFile('test/expected/concat.css');
    test.equal(expected, actual, 'should concat output when passed an array');

    test.done();
  },
  nib: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/nib_.css');
    var expected = readFile('test/expected/nib_/nib_.css');
    test.equal(expected, actual, 'Nib should be available to include');

    test.done();
  },
  autocompress: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/autocompress.css');
    var expected = readFile('test/expected/autocompress.css');
    test.equal(expected, actual, 'output should be compressed when `compress` option not defined');

    test.done();
  },
  plugin: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/plugin.css');
    var expected = readFile('test/expected/plugin/plugin.css');
    test.equal(expected, actual, 'variable defined via plugin should be accessible in stylesheet');

    test.done();
  },
  embedurl: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/embedurl.css');
    var expected = readFile('test/expected/embedurl/embedurl.css');
    test.equal(expected, actual, '`embedurl` mixin should embed image as Data URI');

    test.done();
  },
  relative: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/relative.css');
    var expected = readFile('test/expected/relative/relative.css');
    test.equal(expected, actual, 'import of relative paths should work without `paths` option');

    test.done();
  },
  import: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/import.css');
    var expected = readFile('test/expected/import/import.css');
    test.equal(expected, actual, 'import option should make imported packages available to each compiled styl file');

    test.done();
  },
  define: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/define.css');
    var expected = readFile('test/expected/define/define.css');
    test.equal(expected, actual, 'variables defined via define object in options should be accessible in stylesheet');

    test.done();
  },
  banner: function(test) {
    'use strict';

    test.expect(1);

    var actual = readFile('tmp/banner.css');
    var expected = readFile('test/expected/banner/banner.css');
    test.equal(expected, actual, 'should prefix with baner');

    test.done();
  }
};
