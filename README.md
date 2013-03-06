# TopCoat
An Open Source UI Library for creating beautiful and responsive applications using web standards

---

## Usage

* [Download TopCoat](http://github.com/topcoat/topcoat/tags)

* Copy all the contents of the release folder to your desired project.
* Link the CSS into your page

        <link rel="stylesheet" type="text/css" href="css/topcoat-desktop-min.css">

_*Alternatively incorporate the css into your build process if you are so
inclined._

---

## Contributing

Start by checking out our [Backlog](http://huboard.com/topcoat/topcoat/board)
The idea is that items in the ready column are open for anyone to work on.

_*We use [Huboard](https://github.com/rauhryan/huboard) to keep our issues
organized into a backlog._

* [Fill out the CLA here](http://topcoat.io/topcoat/dev/topcoat-cla.html)
* [fork](https://help.github.com/articles/fork-a-repo) the repo
* Create a branch

        git checkout -b my_branch

* Add your changes following the [coding guidelines](https://github.com/topcoat/topcoat/wiki/Coding-Guidelines)
* Commit your changes

        git commit -am "Added some awesome stuff"

* Push your branch

        git push origin my_branch

* make a [pull request](https://help.github.com/articles/using-pull-requests)

For the details see our [Engineering Practices](https://github.com/topcoat/topcoat/wiki/Engineering-Practices).

### Testing

For performance tests, see [test/perf/telemetry/README.md](https://github.com/topcoat/topcoat/blob/master/test/perf/telemetry/README.md).

### Building

TopCoat uses [Grunt](http://gruntjs.com/) to build

* Open the terminal from the topcoat directory

        cd topcoat

* Install [npm](http://nodejs.org/download/)
_*comes packaged with node._
* Install its command line interface (CLI) globally

        npm install -g grunt-cli

* Install dependencies with npm

        npm install


_*Topcoat uses Grunt 0.4.0 you might want to [read](http://gruntjs.com/getting-started) more on their website if you haven't upgraded since a lot has changed.._

* Type `grunt` in the command line to build the css.
* The results will be built into the release folder.
* Alternatively type `grunt watch` to have the build run automatically when you make changes to
source files.

---

## Release notes
See [Release Notes](https://github.com/topcoat/topcoat/wiki/Release-Notes) on the wiki.

---

## License

[Apache license](https://raw.github.com/topcoat/topcoat/master/LICENSE)
