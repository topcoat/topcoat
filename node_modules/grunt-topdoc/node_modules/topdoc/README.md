#Topdoc [![Build Status](https://travis-ci.org/topcoat/topdoc.png)](https://travis-ci.org/topcoat/topdoc)

[![NPM](https://nodei.co/npm/topdoc.png)](https://nodei.co/npm/topdoc)

A tool for generating usage guides for css.

##Topdoc Comment Specification

Topdoc uses css-parse to divide asunder your css document and find all the relevant Topdoc comments.

Below is an example of a Topdoc comment, take a look, and then read the explanation under it.

```css
/* topdoc
  name: Button
  description: A simple button
  modifiers:
    :active: Active state
    .is-active: Simulates an active state on mobile devices
    :disabled: Disabled state
    .is-disabled: Simulates a disabled state on mobile devices
  markup:
    <a class="topcoat-button">Button</a>
    <a class="topcoat-button is-active">Button</a>
    <a class="topcoat-button is-disabled">Button</a>
  example: http://codepen.io/
  tags:
    - desktop
    - light
    - mobile
    - button
    - quiet
  blarg: very true
*/
.topcoat-button,
.topcoat-button--quiet,
.topcoat-button--large,
.topcoat-button--large--quiet,
.topcoat-button--cta,
.topcoat-button--large--cta {
/* all your css junk here */
```

Topdoc comments must start with `topdoc` on the first comment line, it makes it quick and easy to identify from other comments.

The rest of the data uses a [YAML](http://www.yaml.org/) friendly syntax.

The fields can be in any order, but this is a good example for consistency sake.

The following are recommend and/or required fields:

* `name` (required): The full name of the component.  Feel free to use spaces, punctuation, etc (name: Sir Button III, esq.)
* `description`: Something more descriptive then the title alone.
* `modifiers`: These can be psuedo classes, or addition rules applied to the component. This must be a [YAML mapping](http://yaml4r.sourceforge.net/doc/page/collections_in_yaml.htm) (`*modifier*:*description*`) which becomes a js hash
* `markup` (required): This is the magic; it's the html that will be used to display the component in the docs.
* `tags`: Just some obligitory metadata.
* `blarg`: Since Topdoc uses a flexible YAML syntax, feel free to add any additional custom data you might need for your template.

Topdoc assumes everything between two Topdoc comments, and everything after the last Topdoc comment, is a component.  Put anything that isn't a component (general styles) above the first Topdoc comment.

##Installation

Install with npm.  It's meant to be command line tool, so you probably want to install it globally (with `-g`).

```bash
npm install -g topdoc
```

##Help

The output of the help command.

```bash
-h, --help                                       output usage information
-s, --source <directory>                         The css source directory.
-d, --destination <directory>                    The destination directory where the usage guides will be written.
-t, --template <jade file/directory>             The path to the jade template file.  If it is a directory it will import all the sub files.
-p. --project <title>                            The title for your project.  Defaults to the directory name.
-V, --version                                    output the version number
```

##Command Line Options

###Source

Specify a source directory with `-s` or `--source`.  Defaults to `src/`.

```bash
topdoc -s release/css/
```

###Destination

Specify a destination with `-d` or `--destination`.  Defaults to `docs/`.

```bash
topdoc -d topdocs/
```

###Template

Specify a template with `-t` or `--template`.  A default template is included in Topdoc if one is not provided.

The template can be a single [jade](https://github.com/visionmedia/jade) file:

```bash
topdoc -t template/template.jade
```

or a directory (it will duplicate the whole template directory and look for index.jade in the template folder provided):

```bash
topdoc -t /template
```

This includes npm installed templates

```bash
topdoc -t node_modules/topdoc-theme
```

###Project Title

The project title will be passed through to the jade template file.

```bash
topdoc -p Awesome
```

In the jade file it is `project.title`:

```jade
title=project.title
```
yeilds:
```html
<title>Awesome</title>
```

##package.json Configuration

All the options can be configured in the package.json file.  This is super helpful if you are always using the same configuration.  It will look in the package.json file if it exists, but can be overridden by the command line options.

Also, additional data can be passed through to the jade template.  Below is an example:

```json
{
  "name": "topcoat-test",
  "version": "0.4.1",
  "description": "CSS for clean and fast web apps",
  "main": "Gruntfile.js",
  "dependencies": {
    "topdoc": "0.0.12"
  },
  "topdoc": {
    "source": "release/css/",
    "destination": "topdocs/",
    "template": "node_modules/topdoc-theme",
    "templateData": {
      "title": "Topcoat",
      "subtitle": "CSS for clean and fast web apps",
      "download": {
        "url": "#",
        "label": "Download version 0.4"
        },
      "homeURL": "http://topcoat.io",
      "siteNav": [
        {
          "url": "http://www.garthdb.com", 
          "text": "Usage Guidelines"
        },
        {
          "url": "http://bench.topcoat.io/",
          "text": "Benchmarks"
        },
        {
          "url": "http://topcoat.io/blog",
          "text": "Blog"
        }
      ]
    }
  }
}
```
In the jade template the data is accessible using `tesmplateData`:

```jade
p=templateData.subtitle
```
yeilds:
```html
<p>CSS for clean and fast web apps</p>
```

##Template

The jade template has data passed through by default:

####Document Object
The `document` object contains relevant information about just the current document being generated below is an example:

```json
{
  "title": "Button",
  "filename": "button.css",
  "source": "test/cases/button.css",
  "template": "lib/template.jade",
  "url": "index.html",
  "components": [
    {
      "name": "Button",
      "slug": "button",
      "details": ":active - Active state\n.is-active - Simulates an active state on mobile devices\n:disabled - Disabled state\n.is-disabled - Simulates a disabled state on mobile devices",
      "markup": "<a class=\"topcoat-button\">Button</a>\n<a class=\"topcoat-button is-active\">Button</a>\n<a class=\"topcoat-button is-disabled\">Button</a>",
      "css": ".topcoat-button,\n.topcoat-button--quiet,\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button--cta,\n.topcoat-button--large--cta {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-background-clip: padding;\n  -moz-background-clip: padding;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  padding: 0 1.16rem;\n  font-size: 12px;\n  line-height: 2rem;\n  letter-spacing: 1px;\n  color: #c6c8c8;\n  text-shadow: 0 -1px rgba(0,0,0,0.69);\n  vertical-align: top;\n  background-color: #595b5b;\n  -webkit-box-shadow: inset 0 1px rgba(255,255,255,0.12);\n  box-shadow: inset 0 1px rgba(255,255,255,0.12);\n  border: 1px solid rgba(0,0,0,0.36);\n  -webkit-border-radius: 3px;\n  border-radius: 3px;\n}\n.topcoat-button:active,\n.topcoat-button.is-active,\n.topcoat-button--large:active,\n.topcoat-button--large.is-active {\n  background-color: #404141;\n  -webkit-box-shadow: inset 0 1px rgba(0,0,0,0.18);\n  box-shadow: inset 0 1px rgba(0,0,0,0.18);\n}\n.topcoat-button:disabled,\n.topcoat-button.is-disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n"
    },
    {
      "name": "Quiet Button",
      "slug": "quiet-button",
      "details": ":active - Quiet button active state\n.is-active - Simulates active state for a quiet button on touch interfaces\n:disabled - Disabled state\n.is-disabled - Simulates disabled state",
      "markup": "<a class=\"topcoat-button--quiet\">Button</a>\n<a class=\"topcoat-button--quiet is-active\">Button</a>\n<a class=\"topcoat-button--quiet is-disabled\">Button</a>",
      "css": ".topcoat-button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.topcoat-button--quiet:active,\n.topcoat-button--quiet.is-active,\n.topcoat-button--large--quiet:active,\n.topcoat-button--large--quiet.is-active {\n  color: #c6c8c8;\n  text-shadow: 0 -1px rgba(0,0,0,0.69);\n  background-color: #404141;\n  border: 1px solid rgba(0,0,0,0.36);\n  -webkit-box-shadow: inset 0 1px rgba(0,0,0,0.18);\n  box-shadow: inset 0 1px rgba(0,0,0,0.18);\n}\n.topcoat-button--quiet:disabled,\n.topcoat-button--quiet.is-disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n"
    }
  ]
}
```
####Nav Object
The `nav` object contains names and urls to all the generated html files.  In the jade template this can utilized to create a navigation to the other pages.
```jade
nav.site: ul
	- each item in nav
		- if(item.url == document.url)
			li.selected: a(href=item.url)=item.text
		- else
			li: a(href=item.url)=item.text
```

####Project Object
The `project` object contains relevant project information.  Currently it only contains the `title` property. (passed through the command line `-p` option, or thorugh the package.json information).

```jade
title=project.title
```

####TemplateData Object
As mentioned above, additional data can be passed through to the template in the package.json file.  This is accessible in the template as the `templateData` object.  See the example above.
