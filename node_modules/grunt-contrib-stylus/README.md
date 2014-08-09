# grunt-contrib-stylus [![Build Status](https://travis-ci.org/gruntjs/grunt-contrib-stylus.png?branch=master)](https://travis-ci.org/gruntjs/grunt-contrib-stylus)

> Compile Stylus files to CSS.



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-stylus --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-stylus');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.1](https://github.com/gruntjs/grunt-contrib-stylus/tree/grunt-0.3-stable).*



## Stylus task
_Run this task with the `grunt stylus` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

This task comes preloaded with [nib](http://visionmedia.github.com/nib/).
### Options

#### compress
Type: `Boolean`
Default: true

Specifies if we should compress the compiled css. Compression is always disabled when `--debug` flag is passed to grunt.

#### linenos
Type: `Boolean`
Default: false

Specifies if the generated CSS file should contain comments indicating the corresponding stylus line.

#### firebug
Type: `Boolean`
Default: false

Specifies if the generated CSS file should contain debug info that can be used by the FireStylus Firebug plugin

#### paths
Type: `Array`

Specifies directories to scan for @import directives when parsing.

#### define
Type: `Object`

Allows you to define global variables in Gruntfile that will be accessible in Stylus files.

#### urlfunc
Type: `String`

Specifies function name that should be used for embedding images as Data URI.

###### [use](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#usefn)
Type: `Array`

Allows passing of stylus plugins to be used during compile.

###### [import](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#importpath)
Type: `Array`

Import given stylus packages into every compiled `.styl` file, as if you wrote `@import '...'`
in every single one of said files.


###### include css
Type: `Boolean` Default: false

When including a css file in your app.styl by using @import "style.css", by default it will not include the full script, use `true` to compile into one script. ( NOTICE: the object key contains a space )

###### banner
Type: `String`
Default: empty string

This string will be prepended to the beginning of the compiled output. It is processed using [grunt.template.process][], using the default options.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

[grunt.template.process]: https://github.com/gruntjs/grunt/wiki/grunt.template#wiki-grunt-template-process

### Examples

```js
stylus: {
  compile: {
    options: {
      paths: ['path/to/import', 'another/to/import'],
      urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
      use: [
        require('fluidity') // use stylus plugin at compile time
      ],
      import: [    //  @import 'foo', 'bar/moo', etc. into every .styl file
      'foo',       //  that is compiled. These might be findable based on values you gave
      'bar/moo'    //  to `paths`, or a plugin you added under `use`
      ]
    },
    files: {
      'path/to/result.css': 'path/to/source.styl', // 1:1 compile
      'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile and concat into single file
    }
  }
}
```


## Release History

 * 2013-07-11   v0.6.0   Update to stylus 0.33
 * 2013-03-10   v0.5.0   Upgrade to stylus 0.32.1
 * 2013-02-22   v0.4.1   Support stylus `define` option.
 * 2013-02-15   v0.4.0   First official release for Grunt 0.4.0.
 * 2013-01-23   v0.4.0rc7   Updating grunt/gruntplugin dependencies to rc7. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions.
 * 2013-01-09   v0.4.0rc5   Updating to work with grunt v0.4.0rc5. Switching to this.file api.
 * 2012-12-15   v0.4.0a   Conversion to grunt v0.4 conventions. Remove node v0.6 and grunt v0.3 support. Merge grunt-stylus features (plugin loading, embedding). Remove experimental destination wildcards.
 * 2012-10-12   v0.3.1   Rename grunt-contrib-lib dep to grunt-lib-contrib.
 * 2012-09-24   v0.3.0   Options no longer accepted from global config key. Individually compile into dest, maintaining folder structure.
 * 2012-09-17   v0.2.2   Tests refactored, better watch integration.
 * 2012-09-10   v0.2.0   Refactored from grunt-contrib into individual repo.

---

Task submitted by [Eric Woroshow](http://ericw.ca)

*This file was generated on Thu Jul 11 2013 10:30:27.*
