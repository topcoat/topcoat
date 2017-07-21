![spectrum-logo](https://git.corp.adobe.com/storage/user/655/files/a13fda74-9d4a-11e6-9aec-1b320823594a)
# spectrum-css
The goal of this project is to provide a standard CSS implementation of the [Spectrum][spectrum-link] design language.  

This project makes use of Spectrum DNA generated data, and its output is meant to be used to type components in the [Torq Spectrum Web SDK](torq-spectrum-web-sdk), [React-Spectrum](reactspectrum-link), or [CoralUI](coralui-link). **Consider using one of these projects instead of Spectrum CSS directly.**

The output from this project can be seen [on Jenkins](https://designcodestuff.ci.corp.adobe.com:12001/job/spectrum-css/lastSuccessfulBuild/artifact/dist/docs/index.html).

## Spectrum, DNA, and Spectrum-CSS
Spectrum, the design language, is represented by the DNA project as data values in JSON.  This is the `spectrum-origins` repository.  The structure of that repo is detailed in the readme.

That JSON data must be compiled into output that can be consumed by UI frameworks.  The `balthazar` project contains tooling to do that conversion. In this case, the `spectrum-css` project uses `balthazar` to extract native CSS vars.  There is a `balthazar-config.json` file in the `spectrum-css` project that drives what values are extracted.  If a new element is added to `spectrum-css`, there must be an entry added to `balthazar-config.json` to be sure the values needed for the new element are available.

The `spectrum-css` project can build both a 'multi-stop' and 'single-stop' version of the CSS. This enables a consumer to either allow for multiple Spectrum colorstops in a single CSS file, or can limit the number of selectors to only those needed for a single colorstop.

`spectrum-css` organizes the CSS source files in the `src` folder.   Each Spectrum element has it's own folder.  That folder contains an `index.css` file for the basic structual CSS for all variants of an element.  There is also a `skin.css` file to hold the values that change when the colorstop of the element is specified.

The CSS source files also contain [Topdoc](topdoc_link) comments with a placeholder for documentation values that are injected at build time.  The source of those injected values is found in the YAML formatted files in the `docs` folder.  A key part of the docs data is the `markup` node, which contains the HTML elements needed to apply the corresponding element selectors and render the elements as generated Topdoc output.

A successful build will create a `dist` folder.  The `dist/docs` folder is where the Topdoc output and related template files will end up.  The

The README for files for `spectrum-css`, `balthazar`, and `spectrum-origins` are helpful for more details.

## Using Spectrum CSS

Spectrum CSS can be consumed as whole or in part with two distinct methods of applying colorstops.

### Multi-stop Strategy

The first method of applying colorstops, *multistop*, makes it possible to have any number of colorstops on the same page. This method results in slightly larger CSS files with more selectors, but is the method most products will use as dark and light colorstops are commonly mixed in Spectrum designs.

1. To get all Spectrum components, include `dist/spectrum-core.css` then `dist/spectrum-COLORSTOP.css` for each colorstop you need (where `COLORSTOP` is light, dark, etc).

2. To get only the CSS for components and colorstops you need, include the following to start:

* `dist/components/page/index.css`
* `dist/components/page/multiStops/COLORSTOP.css` for each colorstop
* `dist/components/typography/index.css`
* `dist/components/typography/multiStops/COLORSTOP.css` for each colorstop

Then, for each component you need:

* `dist/components/COMPONENT/index.css` for each component
* `dist/components/COMPONENT/multiStops/COLORSTOP.css` for each colorstop

Set `<body class="spectrum spectrum--light">` to skin the page with light colors, and add `<div class="spectrum--dark">` wherever you need dark styles, or any combination of the above.

Note that, due to CSS selector specificity, whatever colorstop you import last will win if you nest colorstops 3 levels deep. That is, if you first import the `light` colorstop, the the `dark` colorstop, and you have the following HTML, the 3rd button ends up dark.

```html
<body class="spectrum spectrum--light">
  <button class="spectrum-Button">I'm light!</button>

  <div class="spectrum--dark">
    <button class="spectrum-Button">I'm dark!</button>

    <div class="spectrum--light">
      <button class="spectrum-Button">I'm still dark!</button>
    </div>
  </div>
</body>
```

### Single-stop Strategy

The second method of applying colorstops, *singlestops*, makes it so it's only possible to have a single colorstop on the page at once. This method results in less selectors and smaller CSS files.

1. To get all Spectrum components for a specific colorstop, include only `dist/standalone/spectrum-COLORSTOP.css`.

2. To get only the CSS for components you need and a single colorstop, include the following to start:

* `dist/components/page/index.css`
* `dist/components/page/colorStop/COLORSTOP.css` for the single colorstop
* `dist/components/typography/index.css`
* `dist/components/typography/colorStop/COLORSTOP.css` for the single colorstop

Then, for each component you need:

* `dist/components/COMPONENT/index.css` for each component
* `dist/components/COMPONENT/colorStop/COLORSTOP.css` for the single colorstop

As there is CSS for only one color stop present, simply set `<body class="spectrum">`. If mixing with individual components using the *multistop* strategy, you can add `class="spectrum--dark"` on `<body>` or anywhere else, but it only affects components whose colorstops were imported using the individual component multistop strategy.


### Import Order

With Spectrum CSS, dependency management between components is the responsibility of the consumer, you. The framework you're building likely has dependencies itself, such as `dropdown` depends on `button`, and each of the components includes its CSS. If this is the case, you'll get the CSS in the right order automatically, since `dropdown` is going to depend on `button`, and `button` will import the necessary CSS.

However, if you're doing a more manual inclusion of CSS files, the easiest thing to do is to use the fully built `dist/spectrum-core.css` + `dist/spectrum-light.css` or `dist/standalone/spectrum-light.css` files described above. If you need only specific components, be sure to follow the order in `src/components.css` so components can override styles of their dependencies. 


## Project Structure

In this project, there are three sets of source files.  
- `src/`: contains the source for element CSS selectors, with related attribute/value pairs.
- `docs/`: this is the 'default' markup (in [topdoc](topdoc-link) format) that aligns with the CSS generated by this project. Documentation is generated using the metadata stored here.

## Building

Run the following commands:

```
npm install
gulp
```

Your `dist/` folder should now have a local copy of the Spectrum CSS docs and ready-to-use CSS files.

## Learn More
For [general information](https://git.corp.adobe.com/Spectrum/README) about the projects in this org, how to communicate with the development team, where to file issues, or how to contribute, please check out the generic [Spectrum/README](https://git.corp.adobe.com/Spectrum/README) information.

[spectrum-link]: http://spectrum.corp.adobe.com
[topdoc-link]: https://github.com/Topdoc/topdoc/wiki
[coralui-link]: http://coralui.corp.adobe.com/
[reactspectrum-link]: https://git.corp.adobe.com/React/react-spectrum
[torq-spectrum-web-sdk]: https://git.corp.adobe.com/torq/torq-web-spectrum
