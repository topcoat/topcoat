/*
 * gaze
 * https://github.com/shama/gaze
 *
 * Copyright (c) 2012 Kyle Robinson Young
 * Licensed under the MIT license.
 */

'use strict';

// libs
var events = require('events');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var Glob = require('glob').Glob;
var minimatch = require('minimatch');
var Gaze, gaze;

// globals
var delay = 10;

// exports
module.exports = gaze;

// Node v0.6 compat
fs.existsSync = fs.existsSync || path.existsSync;
path.sep = path.sep || path.normalize('/');

// CoffeeScript's __extends utility
var __extends = function(child, parent) {
  for (var key in parent) {
    if ({}.hasOwnProperty.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function Ctor() {
    this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

// Main entry point. Start watching and call done when setup
function gaze(files, opts, done) {
  return new Gaze(files, opts, done);
}

// `Gaze` EventEmitter object to return in the callback
Gaze = gaze.Gaze = __extends(function(files, opts, done) {
  var _this = this;

  // If second arg is the callback
  if (typeof opts === 'function') {
    done = opts;
    opts = {};
  }

  // Default options
  this.options = _.defaults(opts || {}, {
    // Tell glob to mark directories
    mark: true,
    // Interval to pass to fs.watchFile
    interval: 100,
    // Delay for events called in succession for the same file/event
    debounceDelay: 500,
    // Use a desired watch method over the other
    forceWatchMethod: false
  });

  // Default done callback
  done = done || function() {};

  // Remember our watched dir:files
  this._watched = Object.create(null);

  // Store watchers
  this._watchers = Object.create(null);

  // Store patterns
  this._patterns = [];

  // Cached events for debouncing
  this._cached = Object.create(null);

  // Set maxListeners
  if (this.options.maxListeners) {
    this.setMaxListeners(this.options.maxListeners);
    Gaze.__super__.setMaxListeners(this.options.maxListeners);
    delete this.options.maxListeners;
  }

  // Initialize the watch on files
  this.add(files, function() {
    _this._initWatched(done);
  });

  return this;
}, events.EventEmitter);

// Override the emit function to emit `all` events
// and debounce on duplicate events per file
Gaze.prototype.emit = function() {
  var _this = this;
  var args = arguments;

  var e = args[0];
  var filepath = args[1];
  var timeoutId;

  // If not added/deleted/changed/renamed then just emit the event
  if (e.slice(-2) !== 'ed') {
    Gaze.__super__.emit.apply(_this, args);
    return this;
  }

  // Detect rename event, if added and previous deleted is in the cache
  if (e === 'added') {
    Object.keys(this._cached).forEach(function(oldFile) {
      if (_.indexOf(_this._cached[oldFile], 'deleted') !== -1) {
        args[0] = e = 'renamed';
        [].push.call(args, oldFile);
        delete _this._cached[oldFile];
        return false;
      }
    });
  }

  // If cached doesnt exist, create a delay before running the next
  // then emit the event
  var cache = this._cached[filepath] || [];
  if (_.indexOf(cache, e) === -1) {
    this._objectPush(_this._cached, filepath, e);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      delete _this._cached[filepath];
    }, this.options.debounceDelay);
    // Emit the event and `all` event
    Gaze.__super__.emit.apply(_this, args);
    Gaze.__super__.emit.apply(_this, ['all', e].concat([].slice.call(args, 1)));
  }

  return this;
};

// Close watchers
Gaze.prototype.close = function(_reset) {
  var _this = this;
  _reset = _reset === false ? false : true;
  Object.keys(this._watchers).forEach(function(file) {
    _this._watchers[file].close();
  });
  this._watchers = Object.create(null);
  Object.keys(this._watched).forEach(function(dir) {
    fs.unwatchFile(dir);
    _this._watched[dir].forEach(fs.unwatchFile);
  });
  if (_reset) {
    this._watched = Object.create(null);
    this.removeAllListeners();
    _this.emit('end');
  }
  return this;
};

// Add file patterns to be watched
Gaze.prototype.add = function(files, done) {
  var _this = this;
  if (typeof files === 'string') {
    files = [files];
  }
  this._patterns = _.union(this._patterns, files);
  async.forEachSeries(files, function(pattern, next) {
    if (_.isEmpty(pattern)) { return; }
    _this._glob = new Glob(pattern, _this.options, function(err, files) {
      if (err) {
        _this.emit('error', err);
        return done(err);
      }
      _this._addToWatched(files);
      next();
    });
  }, function() {
    _this.close(false);
    _this._initWatched(done);
  });
};

// Remove file/dir from `watched`
Gaze.prototype.remove = function(file) {
  var _this = this;
  if (this._watched[file]) {
    // is dir, remove all files
    fs.unwatchFile(file);
    this._watched[file].forEach(fs.unwatchFile);
    delete this._watched[file];
  } else {
    // is a file, find and remove
    Object.keys(this._watched).forEach(function(dir) {
      var index = _.indexOf(_this._watched[dir], file);
      if (index) {
        fs.unwatchFile(file);
        delete _this._watched[dir][index];
        return false;
      }
    });
  }
  if (this._watchers[file]) {
    this._watchers[file].close();
  }
  return this;
};

// Return watched files
Gaze.prototype.watched = function() {
  return this._watched;
};

// Returns `watched` files with relative paths to process.cwd()
Gaze.prototype.relative = function(dir, unixify) {
  var _this = this;
  var relative = Object.create(null);
  var relDir, relFile, unixRelDir;
  var cwd = this.options.cwd || process.cwd();
  if (dir === '') { dir = '.'; }
  dir = this._markDir(dir);
  unixify = unixify || false;
  Object.keys(this._watched).forEach(function(dir) {
    relDir = path.relative(cwd, dir) + path.sep;
    if (relDir === path.sep) { relDir = '.'; }
    unixRelDir = unixify ? _this._unixifyPathSep(relDir) : relDir;
    relative[unixRelDir] = _this._watched[dir].map(function(file) {
      relFile = path.relative(path.join(cwd, relDir), file);
      if (_this._isDir(file)) {
        relFile = _this._markDir(relFile);
      }
      if (unixify) {
        relFile = _this._unixifyPathSep(relFile);
      }
      return relFile;
    });
  });
  if (dir && unixify) {
    dir = this._unixifyPathSep(dir);
  }
  return dir ? relative[dir] || [] : relative;
};

// Ensures the dir is marked with path.sep
Gaze.prototype._markDir = function(dir) {
  if (typeof dir === 'string' &&
    dir.slice(-(path.sep.length)) !== path.sep &&
    dir !== '.') {
    dir += path.sep;
  }
  return dir;
};

// Returns boolean whether filepath is dir terminated
Gaze.prototype._isDir = function(dir) {
  if (typeof dir !== 'string') { return false; }
  return (dir.slice(-(path.sep.length)) === path.sep);
};

// Changes path.sep to unix ones for testing
Gaze.prototype._unixifyPathSep = function(filepath) {
  return (process.platform === 'win32') ? String(filepath).replace(/\\/g, '/') : filepath;
};

// Adds files and dirs to watched
Gaze.prototype._addToWatched = function(files) {
  var _this = this;
  var dir, parent;
  var cwd = _this.options.cwd || process.cwd();
  files.forEach(function(file) {
    var filepath = path.resolve(cwd, file);

    // if mark false, use stat to figure the isDir
    // the '/' mark comes from node-glob but we convert it to path.sep
    if (_this.options.mark === false) {
      if (fs.statSync(filepath).isDirectory()) {
        file += '/';
      }
    }

    if (file.slice(-1) === '/') {
      // is dir, init key and sub folder
      filepath = _this._markDir(filepath);
      _this._objectPush(_this._watched, filepath);
      parent = path.dirname(filepath) + path.sep;
      _this._objectPush(_this._watched, parent, filepath);
    } else {
      // is file, add to dir
      dir = path.dirname(filepath) + path.sep;
      _this._objectPush(_this._watched, dir, filepath);
    }
  });
  return this;
};

// Create a `key:[]` if doesnt exist on `obj` then push or concat the `val`
Gaze.prototype._objectPush = function(obj, key, val) {
  if (obj[key] == null) { obj[key] = []; }
  if (_.isArray(val)) { obj[key] = obj[key].concat(val); }
  else if (val) { obj[key].push(val); }
  return obj[key] = _.unique(obj[key]);
};

// Returns true if the file matches this._patterns
Gaze.prototype._isMatch = function(file) {
  var matched = false;
  this._patterns.forEach(function(pattern) {
    if (matched = minimatch(file, pattern)) {
      return false;
    }
  });
  return matched;
};

// Wrapper for fs.watch/fs.watchFile
Gaze.prototype._watchFile = function(file, done) {
  var _this = this;
  var opts = Object.create(this.options);
  // TODO: Optimize this. Should kill the other func per event
  // then unwatch files to not even bother using the method
  var watchOne = function() { done(null, file); };
  var watchTwo = function() { done(null, file); };
  try {
    if (_this.options.forceWatchMethod === false || _this.options.forceWatchMethod === 'new') {
      _this._watchers[file] = fs.watch(file, opts, function(event) {
        if (typeof watchOne === 'function') {
          watchTwo = null;
          watchOne();
        }
      });
    }
    if (_this.options.forceWatchMethod === false || _this.options.forceWatchMethod === 'old') {
      fs.watchFile(file, opts, function(curr, prev) {
        if (curr.mtime.getTime() !== prev.mtime.getTime()) {
          if (typeof watchTwo === 'function') {
            watchOne = null;
            watchTwo();
          }
        }
      });
    }
  } catch (err) {
    if (err.code === 'EMFILE') {
      return this.emit('error', new Error('EMFILE: Too many opened files.'));
    }
    return this.emit('error', err);
  }
  return this;
};

// Initialize the actual watch on `watched` files
Gaze.prototype._initWatched = function(done) {
  var _this = this;
  var cwd = this.options.cwd || process.cwd();
  async.forEachSeries(Object.keys(_this._watched), function(dir, next) {
    var files = _this._watched[dir];

    // Triggered when a watched dir has an event
    _this._watchFile(dir, function(event, dirpath) {
      var relDir = cwd === dir ? '.' : path.relative(cwd, dir);
      return fs.readdir(dirpath, function(err, current) {
        if (err) { return _this.emit('error', err); }
        if (!current) { return; }

        // Get watched files for this dir
        var previous = _this.relative(relDir);

        // If file was deleted
        _.filter(previous, function(file) {
          return _.indexOf(current, file) < 0;
        }).forEach(function(file) {
          var filepath = path.join(dir, file);
          if (!_this._isDir(file)) {
            _this.remove(filepath);
            _this.emit('deleted', filepath);
          }
        });

        // If file was added
        _.filter(current, function(file) {
          return _.indexOf(previous, file) < 0;
        }).forEach(function(file) {
          // Is it a matching pattern?
          if (_this._isMatch(file)) {
            var filepath = path.join(dir, file);
            // Add to watch then emit event
            _this.add(file, function() {
              _this.emit('added', filepath);
            });
          }
        });
      });
    });

    // Watch for change/rename events on files
    files.forEach(function(file) {
      _this._watchFile(file, function(err, filepath) {
        // Only emit changed if the file still exists
        // Prevents changed/deleted duplicate events
        // TODO: This ignores changed events on folders, maybe support this?
        //       When a file is added, a folder changed event emits first
        if (fs.existsSync(filepath) && !_this._isDir(file)) {
          _this.emit('changed', filepath);
        }
      });
    });

    next();
  }, function() {

    // Return this instance of Gaze
    // delay before ready solves a lot of issues
    setTimeout(function() {
      _this.emit('ready', _this);
      done.call(_this, null, _this);
    }, delay + 100);

  });
};
