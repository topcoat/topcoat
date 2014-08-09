'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs');
grunt.util = grunt.util || grunt.utils;

// Node v0.6 compat
path.sep = path.sep || path.normalize('/');

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

// Where our fixtures are
var fixtures = path.join(__dirname, '..', 'fixtures');

// If verbose flag set, display output
var verboseLog = function() {};
if (grunt.util._.indexOf(process.argv, '-v') !== -1) {
  verboseLog = function() { console.log.apply(null, arguments); };
}

// helper for creating assertTasks for testing tasks in child processes
function assertTask(task, options) {
  var spawn = require('child_process').spawn;
  task = task || 'default';
  options = options || {};

  // get next/kill process trigger
  var trigger = options.trigger || 'Waiting...';
  delete options.trigger;

  // CWD to spawn
  var cwd = options.cwd || process.cwd();
  delete options.cwd;

  // Use grunt this process uses
  var spawnOptions = [process.argv[1]];
  // Turn options into spawn options
  grunt.util._.each(options, function(val, key) {
    spawnOptions.push('--' + key);
    spawnOptions.push(val);
  });
  // Add the tasks to run
  spawnOptions.push(task);

  // Return an interface for testing this task
  function returnFunc(runs, done) {
    // Spawn the node this process uses
    var spawnGrunt = spawn(process.argv[0], spawnOptions, {cwd:cwd});
    var out = '';

    if (!grunt.util._.isArray(runs)) {
      runs = [runs];
    }

    // Append a last function to kill spawnGrunt
    runs.push(function() { spawnGrunt.kill('SIGINT'); });

    // After watch starts waiting, run our commands then exit
    spawnGrunt.stdout.on('data', function(data) {
      data = grunt.log.uncolor(String(data));
      out += data;

      // If we should run the next function
      var shouldRun = true;

      // If our trigger has been found
      if (trigger !== false) {
        shouldRun = (grunt.util._.indexOf(data.split("\n"), trigger) !== -1);
      }

      // Run the function
      if (shouldRun) {
        setTimeout(function() {
          var run = runs.shift();
          if (typeof run === 'function') { run(); }
        }, 500);
      }
    });

    // Throw errors for better testing
    spawnGrunt.stderr.on('data', function(data) {
      throw new Error(data);
    });

    // On process exit return what has been outputted
    spawnGrunt.on('exit', function() {
      done(out);
    });
  }
  returnFunc.options = options;
  return returnFunc;
}

exports.watchConfig = {
  setUp: function(done) {
    fs.symlinkSync(path.join(__dirname, '../../node_modules'), path.join(fixtures, 'multiTargets', 'node_modules'));
    fs.symlinkSync(path.join(__dirname, '../../node_modules'), path.join(fixtures, 'oneTarget', 'node_modules'));
    done();
  },
  tearDown: function(done) {
    grunt.file.delete(path.join(fixtures, 'multiTargets', 'node_modules'));
    grunt.file.delete(path.join(fixtures, 'oneTarget', 'node_modules'));
    done();
  },
  oneTarget: function(test) {
    test.expect(2);
    var cwd = path.resolve(fixtures, 'oneTarget');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch(function() {
      var write = 'var test = true;';
      grunt.file.write(path.join(cwd, 'lib', 'one.js'), write);
    }, function(result) {
      verboseLog(result);
      test.ok(result.indexOf('File "lib' + path.sep + 'one.js" changed') !== -1, 'Watch should have fired when oneTarget/lib/one.js has changed.');
      test.ok(result.indexOf('I do absolutely nothing.') !== -1, 'echo task should have fired.');
      test.done();
    });
  },
  multiTargetsTriggerOneNotTwo: function(test) {
    test.expect(2);
    var cwd = path.resolve(fixtures, 'multiTargets');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch(function() {
      var write = 'var test = true;';
      grunt.file.write(path.join(cwd, 'lib', 'one.js'), write);
    }, function(result) {
      verboseLog(result);
      test.ok(result.indexOf('one has changed') !== -1, 'Only task echo:one should of emit.');
      test.ok(result.indexOf('two has changed') === -1, 'Task echo:two should NOT emit.');
      test.done();
    });
  },
  multiTargetsTriggerBoth: function(test) {
    test.expect(2);
    var cwd = path.resolve(fixtures, 'multiTargets');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch([function() {
      grunt.file.write(path.join(cwd, 'lib', 'one.js'), 'var test = true;');
    }, function() {
      grunt.file.write(path.join(cwd, 'lib', 'two.js'), 'var test = true;');
    }], function(result) {
      verboseLog(result);
      test.ok(result.indexOf('one has changed') !== -1, 'Task echo:one should of emit.');
      test.ok(result.indexOf('two has changed') !== -1, 'Task echo:two should of emit.');
      test.done();
    });
  },
  spawnOneAtATime: function(test) {
    test.expect(1);
    var cwd = path.resolve(fixtures, 'multiTargets');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch(function() {
      grunt.file.write(path.join(cwd, 'lib', 'wait.js'), 'var wait = false;');
      setTimeout(function() {
        grunt.file.write(path.join(cwd, 'lib', 'wait.js'), 'var wait = true;');
      }, 500);
    }, function(result) {
      verboseLog(result);
      test.ok(result.indexOf('I waited 2s') !== -1, 'Task should have waited 2s and only spawned once.');
      test.done();
    });
  },
  interrupt: function(test) {
    test.expect(1);
    var cwd = path.resolve(fixtures, 'multiTargets');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch(function() {
      grunt.file.write(path.join(cwd, 'lib', 'interrupt.js'), 'var interrupt = false;');
      setTimeout(function() {
        grunt.file.write(path.join(cwd, 'lib', 'interrupt.js'), 'var interrupt = true;');
      }, 1000);
    }, function(result) {
      verboseLog(result);
      test.ok(result.indexOf('has been interrupted') !== -1, 'Task should have been interrupted.');
      test.done();
    });
  },
  failingTask: function(test) {
    test.expect(2);
    var cwd = path.resolve(fixtures, 'multiTargets');
    var assertWatch = assertTask('watch', {cwd:cwd});
    assertWatch(function() {
      grunt.file.write(path.join(cwd, 'lib', 'fail.js'), 'var fail = false;');
    }, function(result) {
      verboseLog(result);
      test.ok(result.toLowerCase().indexOf('fatal') !== -1, 'Task should have been fatal.');
      test.equal(grunt.util._(result).count('Waiting...'), 2, 'Should have displayed "Wating..." twice');
      test.done();
    });
  }
};
