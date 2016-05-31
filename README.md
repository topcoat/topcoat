# spectrum
> SSOT Spectrum theme POC

## Usage

```sh
git clone git@git.corp.adobe.com:lawdavis/spectrum.git
cd spectrum
npm install
npm run build
open dist
```

## Mechanism: Create a variable for each concept, allow consumers to extend with their own classnames

Pros:

* Very direct
* Easy to override styles

Cons:

* Concepts that affect child elements (such as `.button--square .icon`) can't be captured with nesting and need to be separate concepts completely (i.e. `$button--square-icon`)
* Theme files are more complex, require nesting, lots of `@extends`
