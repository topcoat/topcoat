module.exports = function(gulp) {
  require('run-sequence').use(gulp);

  var gutil = require('gulp-util');
  var git = require('gulp-git');
  var bump = require('gulp-bump');
  var del = require('del');

  var fs = require('fs');
  var inq = require('inquirer');
  var semver = require('semver');
  var runSequence = require('run-sequence').use(gulp);

  function getPackage() {
    return JSON.parse(fs.readFileSync('package.json', 'utf8'));
  }

  gulp.task('do-release', function(cb) {
    var package = getPackage();

    var releaseVersion = package.version;
    var releaseMessage = 'Release ' + releaseVersion;

    git.checkout('release', function(err) {
      if (err) {
        return cb(err);
      }

      // Move files
      gulp.src('dist/**')
      .pipe(gulp.dest('./'))
      .on('end', function() {
        // Commit
        gulp.src([
          './**',
          '!./dist',
          '!./dist/**',
          '!./node_modules',
          '!./node_modules/**'
        ])
        .pipe(git.add())
        .pipe(git.commit(releaseMessage))
        .on('end', function() {
          // Push
          git.push('origin', 'release', function (err) {
            if (err) {
              return cb(err);
            }

            git.tag(releaseVersion, releaseMessage, function(err) {
              if (err) {
                return cb(err);
              }

              git.push('origin', releaseVersion, function(err) {
                if (err) {
                  return cb(err);
                }

                // Return to master
                git.checkout('master', function(cb) {
                  if (err) {
                    return cb(err);
                  }

                  // Push the package.json update to master after a successful release
                  git.push('origin', 'master', cb);
                });
              });
            });
          });
        });
      });
    });
  });

  gulp.task('copy-package', function() {
    return gulp.src('./package.json')
    .pipe(gulp.dest('./dist/'));
  });

  /**
    Optional args:
      --patch - Specify a patch release
      --minor - Specify a minor release
      --major - Specify a major release
      --prerelease - Specify a prerelease
      --prepatch - Specify a patch prerelease
      --preminor - Specify a minor prerelease
      --premajor - Specify a major prerelease
  */
  gulp.task('bump-version', function(cb) {
    function doVersionBump() {
      gulp.src('./package.json')
      .pipe(bump({ version: releaseVersion }))
      .pipe(gulp.dest('./'))
      .pipe(git.commit(releaseVersion))
      .on('end', cb);
    }

    var package = getPackage();

    // The version we'll actually release
    var releaseVersion = null;

    // Potential versions
    var patchVersion = semver.inc(package.version, 'patch');
    var minorVersion = semver.inc(package.version, 'minor');
    var majorVersion = semver.inc(package.version, 'major');
    var preVersion = semver.inc(package.version, 'prerelease', 'pre');
    var preMajorVersion = semver.inc(package.version, 'premajor', 'pre');
    var preMinorVersion = semver.inc(package.version, 'preminor', 'pre');
    var prePatchVersion = semver.inc(package.version, 'prepatch', 'pre');

    // Command line bump shortcuts
    if (gutil.env.pre) {
      releaseVersion = preVersion
    }
    else if (gutil.env.patch) {
      releaseVersion = patchVersion
    }
    else if (gutil.env.minor) {
      releaseVersion = minorVersion
    }
    else if (gutil.env.major) {
      releaseVersion = majorVersion
    }
    else if (gutil.env.prepatch) {
      releaseVersion = prePatchVersion
    }
    else if (gutil.env.preMinorVersion) {
      releaseVersion = prePatchVersion
    }
    else if (gutil.env.preMajorVersion) {
      releaseVersion = prePatchVersion
    }

    if (releaseVersion) {
      doVersionBump();
    }
    else {
      var choices = [
        {
          name: 'patch - ' + patchVersion,
          value: patchVersion
        },
        {
          name: 'minor - ' + minorVersion,
          value: minorVersion
        },
        {
          name: 'major - ' + majorVersion,
          value: majorVersion
        }
      ];

      if (package.version.match('-pre')) {
        choices = [
          {
            name: 'prerelease - ' + preVersion,
            value: preVersion
          },
          {
            name: 'release - ' + patchVersion,
            value: patchVersion
          }
        ];
      }

      choices = choices.concat([
        {
          name: 'prepatch - ' + prePatchVersion,
          value: prePatchVersion
        },
        {
          name: 'preminor - ' + preMinorVersion,
          value: preMinorVersion
        },
        {
          name: 'premajor - ' + preMajorVersion,
          value: preMajorVersion
        }
      ]);

      inq.prompt([{
        type: 'list',
        name: 'version',
        message: 'What version would you like?',
        choices: choices
      }])
      .then(function(res) {
        // Use command-line arguments, if provided
        releaseVersion = res.version;

        doVersionBump();
      });
    }
  });

  gulp.task('gh-pages', ['build', 'zip'], function(cb) {
    var package = getPackage();

    git.checkout('gh-pages', function(err) {
      if (err) {
        return cb(err);
      }

      // Move files
      gulp.src('dist/**')
      .pipe(gulp.dest('./'))
      .on('end', function() {
        // Commit
        gulp.src([
          './**',
          '!./dist',
          '!./dist/**',
          '!./node_modules',
          '!./node_modules/**'
        ])
        .pipe(git.add())
        .pipe(git.commit('Deploy website for ' + package.version))
        .on('end', function() {
          // Push
          git.push('origin', 'gh-pages', function (err) {
            if (err) {
              return cb(err);
            }

            // Return to master
            git.checkout('master', cb);
          });
        });
      });
    });
  });

  /**
    Optional args:
      --confirm - Don't ask for confirmation
  */
  gulp.task('release', function (cb) {
    function beginRelease() {
      runSequence(
        'build',
        'copy-package',
        'do-release',
        'gh-pages',
        function (err) {
          if (err) {
            console.error(err.message);
          }
          else {
            console.log('Release successful.');
          }
          cb(err);
        }
      );
    }

    runSequence('bump-version', function (err) {
      var package = getPackage();

      // Command line shortcut
      if (gutil.env.confirm) {
        beginRelease();
      }
      else {
        inq.prompt({
          type: 'confirm',
          name: 'confirmed',
          message: 'Release ' + package.version + '?'
        })
        .then(function(res) {
          if (res.confirmed) {
            beginRelease();
          }
          else {
            cb();
          }
        });
      }
    });
  });
};
