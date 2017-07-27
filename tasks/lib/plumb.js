var plumber = require('gulp-plumber');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
};

module.exports = function() {
  return plumber({ errorHandler: handleError });
};
