var gulp = require('gulp');
var git = require('gulp-git');
var fs = require('fs');
var package = JSON.parse(fs.readFileSync('./package.json'));

gulp.task('gh-pages', function(cb) {
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
          './components',
          './docs',
          './standalone',
          './vars',
          './icons',
          './spectrum*'
        ])
          .pipe(git.commit('Deploy version ' + package.version))
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