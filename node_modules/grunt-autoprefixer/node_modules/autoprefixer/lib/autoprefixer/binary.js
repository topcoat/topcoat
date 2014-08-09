(function() {
  var Binary, autoprefixer, fs;

  autoprefixer = require('../autoprefixer');

  fs = require('fs');

  Binary = (function() {
    function Binary(process) {
      this["arguments"] = process.argv.slice(2);
      this.stdin = process.stdin;
      this.stderr = process.stderr;
      this.stdout = process.stdout;
      this.status = 0;
      this.command = 'compile';
      this.inputFiles = [];
      this.parseArguments();
    }

    Binary.prototype.help = function() {
      var h;
      h = [];
      h.push('Usage: autoprefixer [OPTION...] FILES');
      h.push('');
      h.push('Parse CSS files and add prefixed properties and values.');
      h.push('');
      h.push('Options:');
      h.push('  -b, --browsers BROWSERS  add prefixes for selected browsers');
      h.push('  -o, --output FILE        set output CSS file');
      h.push('  -i, --inspect            show selected browsers and properties');
      h.push('  -h, --help               show help text');
      h.push('  -v, --version            print program version');
      return h.join("\n");
    };

    Binary.prototype.desc = function() {
      var h;
      h = [];
      h.push('Files:');
      h.push("  By default, prefixed CSS will rewrite original files.");
      h.push("  If you didn't set input files, " + "autoprefixer will read from stdin stream.");
      h.push("  Output CSS will be written to stdout stream on " + "`-o -' argument or stdin input.");
      h.push('');
      h.push('Browsers:');
      h.push('  Separate browsers by comma. For example, ' + "`-b \"> 1%, opera 12\".");
      h.push("  You can set browsers by global usage statictics: " + "`-b \"> 1%\"'");
      h.push("  or last version: `-b \"last 2 versions\"' (by default).");
      return h.join("\n");
    };

    Binary.prototype.print = function(str) {
      str = str.replace(/\n$/, '');
      return this.stdout.write(str + "\n");
    };

    Binary.prototype.error = function(str) {
      this.status = 1;
      return this.stderr.write(str + "\n");
    };

    Binary.prototype.version = function() {
      return require('../../package.json').version;
    };

    Binary.prototype.parseArguments = function() {
      var arg, args, _results;
      args = this["arguments"].slice();
      _results = [];
      while (args.length > 0) {
        arg = args.shift();
        if (arg === '-h' || arg === '--help') {
          _results.push(this.command = 'showHelp');
        } else if (arg === '-v' || arg === '--version') {
          _results.push(this.command = 'showVersion');
        } else if (arg === '-i' || arg === '--inspect') {
          _results.push(this.command = 'inspect');
        } else if (arg === '-u' || arg === '--update') {
          _results.push(this.command = 'update');
        } else if (arg === '-b' || arg === '--browsers') {
          _results.push(this.requirements = args.shift().split(',').map(function(i) {
            return i.trim();
          }));
        } else if (arg === '-o' || arg === '--output') {
          _results.push(this.outputFile = args.shift());
        } else if (arg.match(/^-\w$/) || arg.match(/^--\w[\w-]+$/)) {
          this.command = void 0;
          this.error("autoprefixer: Unknown argument " + arg);
          this.error('');
          _results.push(this.error(this.help()));
        } else {
          _results.push(this.inputFiles.push(arg));
        }
      }
      return _results;
    };

    Binary.prototype.showHelp = function(done) {
      this.print(this.help());
      this.print('');
      this.print(this.desc());
      return done();
    };

    Binary.prototype.showVersion = function(done) {
      this.print("autoprefixer " + (this.version()));
      return done();
    };

    Binary.prototype.inspect = function(done) {
      this.print(this.compiler().inspect());
      return done();
    };

    Binary.prototype.update = function(done) {
      var coffee, updater,
        _this = this;
      try {
        coffee = require('coffee-script');
      } catch (_error) {
        this.error("Install coffee-script npm package");
        return done();
      }
      updater = require('./updater');
      updater.request(function() {
        return _this.stdout.write('.');
      });
      updater.done(function() {
        _this.print('');
        if (updater.changed.length === 0) {
          _this.print('Everything up-to-date');
        } else {
          _this.print('Update ' + updater.changed.join(' and ') + ' data');
        }
        return done();
      });
      return updater.run();
    };

    Binary.prototype.startWork = function() {
      return this.waiting += 1;
    };

    Binary.prototype.endWork = function() {
      this.waiting -= 1;
      if (this.waiting <= 0) {
        return this.doneCallback();
      }
    };

    Binary.prototype.compiler = function() {
      return this.compilerCache || (this.compilerCache = autoprefixer(this.requirements));
    };

    Binary.prototype.compileCSS = function(css, file) {
      var error, prefixed,
        _this = this;
      try {
        prefixed = this.compiler().compile(css);
      } catch (_error) {
        error = _error;
        if (error.autoprefixer || error.css) {
          this.error("autoprefixer: " + error.message);
        } else {
          this.error('autoprefixer: Internal error');
        }
        if (error.css || !error.autoprefixer) {
          if (error.stack != null) {
            this.error('');
            this.error(error.stack);
          }
        }
      }
      if (!prefixed) {
        return this.endWork();
      }
      if (file === '-') {
        this.print(prefixed);
        return this.endWork();
      } else {
        return fs.writeFile(file, prefixed, function(error) {
          if (error) {
            _this.error("autoprefixer: " + error);
          }
          return _this.endWork();
        });
      }
    };

    Binary.prototype.compile = function(done) {
      var css, file, _fn, _i, _len, _ref,
        _this = this;
      this.waiting = 0;
      this.doneCallback = done;
      if (this.inputFiles.length === 0) {
        this.startWork();
        this.outputFile || (this.outputFile = '-');
        css = '';
        this.stdin.resume();
        this.stdin.on('data', function(chunk) {
          return css += chunk;
        });
        return this.stdin.on('end', function() {
          return _this.compileCSS(css, _this.outputFile);
        });
      } else {
        fs = require('fs');
        _ref = this.inputFiles;
        _fn = function(file) {
          return fs.readFile(file, function(error, css) {
            if (error) {
              return _this.error("autoprefixer: " + error);
            } else {
              css = css.toString();
              return _this.compileCSS(css, _this.outputFile || file);
            }
          });
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          this.startWork();
          if (!fs.existsSync(file)) {
            this.error("autoprefixer: File " + file + " doesn't exists");
            this.endWork();
            return;
          }
          _fn(file);
        }
      }
    };

    Binary.prototype.run = function(done) {
      if (this.command) {
        return this[this.command](done);
      } else {
        return done();
      }
    };

    return Binary;

  })();

  module.exports = Binary;

}).call(this);
