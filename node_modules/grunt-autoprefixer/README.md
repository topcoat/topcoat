# grunt-autoprefixer [![Build Status](https://travis-ci.org/nDmitry/grunt-autoprefixer.png?branch=master)](https://travis-ci.org/nDmitry/grunt-autoprefixer)

> [Autoprefixer](https://github.com/ai/autoprefixer) parses CSS and adds vendor-prefixed CSS properties using the [Can I Use](http://caniuse.com/) database.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-autoprefixer --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-autoprefixer');
```

## The "autoprefixer" task

### Overview
In your project's Gruntfile, add a section named `autoprefixer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autoprefixer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.browsers
Type: `Array`
Default value: `['last 2 versions']`

You can specify browsers actual for your project (by default, it’s
`'last 2 versions'`):

```js
options: {
  browsers: ['last 1 version', '> 1%', 'ie 8', 'ie 7']
}
```

* `last n versions` is last `n` versions for each browser (for example,
  [Google also uses](http://support.google.com/a/bin/answer.py?answer=33864)
  “last 2 version” strategy).
* `> n%` is browser versions, which global usage statistics is more than `n`%.
* You can also set browsers directly.

### Usage Example

#### Default Options

```js
grunt.initConfig({
  autoprefixer: {
    dist: {
      options: {
        browsers: ['last 1 version', '> 1%', 'ie 8', 'ie 7']
      },
      files: {
        'dest/styles.css': ['src/something.css', 'src/whatever.css']
      }
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 07/16/2013 - 0.2.0 - Update the task according to Autoprefixer API changes.
* 04/19/2013 - 0.1.0 - Initial release.
