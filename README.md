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

## Methods

### 1. Extends: Create a variable for each concept, allow consumers to extend with their own classnames

See [poc/extends](poc/extends/).

Pros:

* Very direct
* Easy to override styles

Cons:

* Concepts that affect child elements (such as `.button--square .icon`) can't be captured with nesting and need to be separate concepts completely (i.e. `$button--square-icon`)


### 2. Interpolation: Use variable interpolation to change classnames

See [poc/extends](poc/interpolation/).

Pros:

* Seems simpler (just changing names)
* Very quick to create new themes

Cons:

* Lots of variables to define
* Variables need to be related to structure
* Feels very indirect
