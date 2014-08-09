'use strict';

var gaze = require('../lib/gaze.js');
var path = require('path');
var fs = require('fs');

// Node v0.6 compat
fs.existsSync = fs.existsSync || path.existsSync;

// Clean up helper to call in setUp and tearDown
function cleanUp(done) {
  [
    'sub/tmp.js',
    'sub/tmp',
    'sub/renamed.js',
    'added.js',
    'nested/added.js',
    'nested/sub/added.js'
  ].forEach(function(d) {
    var p = path.resolve(__dirname, 'fixtures', d);
    if (fs.existsSync(p)) { fs.unlinkSync(p); }
  });
  done();
}

exports.watch = {
  setUp: function(done) {
    process.chdir(path.resolve(__dirname, 'fixtures'));
    cleanUp(done);
  },
  tearDown: cleanUp,
  remove: function(test) {
    test.expect(2);
    gaze('**/*', function() {
      this.remove(path.resolve(__dirname, 'fixtures', 'sub', 'two.js'));
      this.remove(path.resolve(__dirname, 'fixtures'));
      var result = this.relative(null, true);
      test.deepEqual(result['sub/'], ['one.js']);
      test.notDeepEqual(result['.'], ['one.js']);
      this.close();
      test.done();
    });
  },
  changed: function(test) {
    test.expect(1);
    gaze('**/*', function(err, watcher) {
      watcher.on('changed', function(filepath) {
        var expected = path.relative(process.cwd(), filepath);
        test.equal(path.join('sub', 'one.js'), expected);
        watcher.close();
        test.done();
      });
      this.on('added', function() { test.ok(false, 'added event should not have emitted.'); });
      this.on('deleted', function() { test.ok(false, 'deleted event should not have emitted.'); });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'), 'var one = true;');
    });
  },
  added: function(test) {
    test.expect(1);
    gaze('**/*', function(err, watcher) {
      watcher.on('added', function(filepath) {
        var expected = path.relative(process.cwd(), filepath);
        test.equal(path.join('sub', 'tmp.js'), expected);
        watcher.close();
        test.done();
      });
      this.on('changed', function() { test.ok(false, 'changed event should not have emitted.'); });
      this.on('deleted', function() { test.ok(false, 'deleted event should not have emitted.'); });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'tmp.js'), 'var tmp = true;');
    });
  },
  dontAddUnmatchedFiles: function(test) {
    test.expect(2);
    gaze('**/*.js', function(err, watcher) {
      setTimeout(function() {
        test.ok(true, 'Ended without adding a file.');
        watcher.close();
        test.done();
      }, 1000);
      this.on('added', function(filepath) {
        test.equal(path.relative(process.cwd(), filepath), path.join('sub', 'tmp.js'));
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'tmp'), 'Dont add me!');
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'tmp.js'), 'add me!');
    });
  },
  deleted: function(test) {
    test.expect(1);
    var tmpfile = path.resolve(__dirname, 'fixtures', 'sub', 'deleted.js');
    fs.writeFileSync(tmpfile, 'var tmp = true;');
    gaze('**/*', function(err, watcher) {
      watcher.on('deleted', function(filepath) {
        test.equal(path.join('sub', 'deleted.js'), path.relative(process.cwd(), filepath));
        watcher.close();
        test.done();
      });
      this.on('changed', function() { test.ok(false, 'changed event should not have emitted.'); });
      this.on('added', function() { test.ok(false, 'added event should not have emitted.'); });
      fs.unlinkSync(tmpfile);
    });
  },
  nomark: function(test) {
    test.expect(1);
    gaze('**/*', {mark:false}, function(err, watcher) {
      watcher.on('changed', function(filepath) {
        var expected = path.relative(process.cwd(), filepath);
        test.equal(path.join('sub', 'one.js'), expected);
        watcher.close();
        test.done();
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'), 'var one = true;');
    });
  },
  dontEmitTwice: function(test) {
    test.expect(2);
    gaze('**/*', function(err, watcher) {
      watcher.on('all', function(status, filepath) {
        var expected = path.relative(process.cwd(), filepath);
        test.equal(path.join('sub', 'one.js'), expected);
        test.equal(status, 'changed');
        fs.readFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'));
        setTimeout(function() {
          watcher.close();
          test.done();
        }, 5000);
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'), 'var one = true;');
    });
  },
  emitTwice: function(test) {
    test.expect(2);
    var times = 0;
    gaze('**/*', function(err, watcher) {
      watcher.on('all', function(status, filepath) {
        test.equal(status, 'changed');
        times++;
        setTimeout(function() {
          if (times < 2) {
            fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'), 'var one = true;');
          } else {
            watcher.close();
            test.done();
          }
        }, 1000);
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'one.js'), 'var one = true;');
    });
  },
  nonExistent: function(test) {
    test.expect(1);
    gaze('non/existent/**/*', function(err, watcher) {
      test.ok(true);
      test.done();
    });
  },
  differentCWD: function(test) {
    test.expect(1);
    var cwd = path.resolve(__dirname, 'fixtures', 'sub');
    gaze('two.js', {
      cwd: cwd
    }, function(err, watcher) {
      watcher.on('changed', function(filepath) {
        test.deepEqual(this.relative(), {'.':['two.js']});
        watcher.close();
        test.done();
      });
      fs.writeFileSync(path.resolve(cwd, 'two.js'), 'var two = true;');
    });
  },
  addedEmitInSubFolders: function(test) {
    test.expect(3);
    var create = [
      path.resolve(__dirname, 'fixtures', 'nested', 'sub', 'added.js'),
      path.resolve(__dirname, 'fixtures', 'added.js'),
      path.resolve(__dirname, 'fixtures', 'nested', 'added.js')
    ];
    var clean = [];
    function createFile() {
      var file = create.shift();
      fs.writeFileSync(file, 'var added = true;');
      clean.push(file);
    }
    gaze('**/*', {debounceDelay:100}, function(err, watcher) {
      watcher.on('added', function(filepath) {
        test.equal('added.js', path.basename(filepath));
        if (create.length < 1) {
          clean.forEach(fs.unlinkSync);
          watcher.close();
          test.done();
        } else {
          createFile();
        }
      });
      createFile();
    });
  },
  forceWatchMethodOld: function(test) {
    test.expect(1);
    gaze('**/*', {forceWatchMethod:'old'}, function(err, watcher) {
      watcher.on('all', function(e, filepath) {
        test.ok(true);
        watcher.close();
        test.done();
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'two.js'), 'var two = true;');
    });
  },
  forceWatchMethodNew: function(test) {
    test.expect(1);
    gaze('**/*', {forceWatchMethod:'new'}, function(err, watcher) {
      watcher.on('all', function(e, filepath) {
        test.ok(true);
        watcher.close();
        test.done();
      });
      fs.writeFileSync(path.resolve(__dirname, 'fixtures', 'sub', 'two.js'), 'var two = true;');
    });
  }
};
