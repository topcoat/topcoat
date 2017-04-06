![spectrum-logo](https://git.corp.adobe.com/storage/user/655/files/a13fda74-9d4a-11e6-9aec-1b320823594a)
# spectrum-css
The goal is to support [Spectrum][spectrum-link] design language documentation by creating a super-lean CSS implementation for use in our vanilla web stack.  It's not supported as a framework for other teams, so re-use at your own peril :)  

## Usage (For Contributors)  
Because we are using scoped releases for NPM, you need to configure the `@spectrum` namespace like this:

`npm config set @spectrum:registry https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-spectrum-snapshot-local/`

Then, set up a local repo like this:

```sh
git clone git@git.corp.adobe.com:<YOUR_USERNAME>/spectrum-css.git
cd spectrum-css
npm install --scope=@spectrum --registry=https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-spectrum-snapshot/
npm run build
```

Build tasks are all based on npm scripts, which can be found in `package.json`.  Just run `npm run <taskname>` and off you go.

The `dist/` folder will contain all the goodies, including a copy of the [style documentation](http://git.corp.adobe/com/pages/spectrum/spectrum-css/)

## Learn More
For [general information](https://git.corp.adobe.com/Spectrum/README) about the projects in this org, how to communicate with the development team, where to file issues, or how to contribute, please check out the generic [Spectrum/README](https://git.corp.adobe.com/Spectrum/README) information.

Thanks - Adobe Design Frameworks

[spectrum-link]: http://spectrum.corp.adobe.com
[slack-link]: https://adobespectrum.slack.com
[dna-link]: http://design-dna.corp.adobe.com
[dna-opendev-link]: https://wiki.corp.adobe.com/display/AdobeDesign/Spectrum+Developer+Docs
[sdl-jira-link]: https://jira.corp.adobe.com/browse/SDL
[dna-jira-link]: https://jira.corp.adobe.com/browse/DNA
[dev-docs-link]: https://wiki.corp.adobe.com/display/AdobeDesign/Spectrum+Developer+Docs
[forking-link]: https://help.github.com/articles/fork-a-repo/
