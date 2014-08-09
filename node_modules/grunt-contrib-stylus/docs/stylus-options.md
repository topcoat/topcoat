# Options

## compress
Type: `Boolean`
Default: true

Specifies if we should compress the compiled css. Compression is always disabled when `--debug` flag is passed to grunt.

## linenos
Type: `Boolean`
Default: false

Specifies if the generated CSS file should contain comments indicating the corresponding stylus line.

## firebug
Type: `Boolean`
Default: false

Specifies if the generated CSS file should contain debug info that can be used by the FireStylus Firebug plugin

## paths
Type: `Array`

Specifies directories to scan for @import directives when parsing.

## define
Type: `Object`

Allows you to define global variables in Gruntfile that will be accessible in Stylus files.

## urlfunc
Type: `String`

Specifies function name that should be used for embedding images as Data URI.

#### [use](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#usefn)
Type: `Array`

Allows passing of stylus plugins to be used during compile.

#### [import](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#importpath)
Type: `Array`

Import given stylus packages into every compiled `.styl` file, as if you wrote `@import '...'`
in every single one of said files.


#### include css
Type: `Boolean` Default: false

When including a css file in your app.styl by using @import "style.css", by default it will not include the full script, use `true` to compile into one script. ( NOTICE: the object key contains a space )

#### banner
Type: `String`
Default: empty string

This string will be prepended to the beginning of the compiled output. It is processed using [grunt.template.process][], using the default options.

_(Default processing options are explained in the [grunt.template.process][] documentation)_

[grunt.template.process]: https://github.com/gruntjs/grunt/wiki/grunt.template#wiki-grunt-template-process
