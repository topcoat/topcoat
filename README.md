![spectrum-logo](https://git.corp.adobe.com/storage/user/655/files/a13fda74-9d4a-11e6-9aec-1b320823594a)
# spectrum-css
The goal is to support [spectrum][spectrum-link] consumption via web by providing a standard implementation that can be integrated into other libraries.  

For now, there is not a large implementation set, only a few components.  Also, the current dependency on [spectrum/palette](http://git.corp.adobe.com/spectrum/palette) is going to be refactored out.  We are working on a larger system called [DNA][dna-link] and that will supersede palette in the near future.

For questions, or to discuss, join us on [Slack][slack-link]!

## Usage  
You can simply grab a [release](https://git.corp.adobe.com/Spectrum/spectrum-css/releases) of this project if you don't want to build it yourself :)

To build this project, follow the steps below.

If you are contributing, please make a [fork][forking-link] of this repo and [do your work][dev-docs-link] in an [issue specific branch][sds-jira-link].

Because we are using scoped releases for NPM, you need to configure the `@spectrum` namespace like this:

`npm config set @spectrum:registry https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-spectrum-snapshot-local/`

Once you are ready, you can get started like this:

```sh
git clone git@git.corp.adobe.com:<YOUR_USERNAME>/spectrum-css.git
cd spectrum-css
npm install --scope=@spectrum --registry=https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-spectrum-snapshot/
npm install
npm run build
```

The `dist/` folder will contain all the goodies, including a copy of the [style documentation](http://git.corp.adobe/com/pages/spectrum/spectrum-css/)

## About Spectrum and DNA
This repository is part of the [Design DNA][dna-link] project, which is a design system being developed by the **Adobe Design Frameworks** team.  Our goal is to support [Spectrum][spectrum-link] consumption by providing source constants, build tools, and implementation support that can be integrated by anyone wanting to conform to the Spectrum design language.

## Open Development
We try to work in compliance with some [Open Development][dna-opendev-link] standards.  See our [open development documentation][dna-opendev-link] for details.

## Problems?
For questions, discussion, or feedback join us on [Slack][slack-link]!  

If the problem is issue worthy, look into our [JIRA project][sdl-jira-link] and open an issue if one isn't there already.

You can also use the mail lists mentioned below.

## Announcements and Communications 

The best way to connect with us is [Slack][slack-link].  Did we mention [Slack][slack-link]?  We use [Slack][slack-link] a lot, check out the #dev and #dna-contributors-dev channels to find us.


We also have mail lists for those just wanting announcements, or the answer to an FAQ. One is specific to DNA, the other Spectrum:
* grp-design-dna-informed@adobe.com
* spectrum-informed@adobe.com

Because sometimes archived, threaded email conversations are a good thing for development, we have the required contributors mailing list:
* cg-design-dna-contributors@adobe.onmicrosoft.com


Thanks - Adobe Design Frameworks

[spectrum-link]: http://spectrum.corp.adobe.com
[slack-link]: https://adobespectrum.slack.com
[dna-link]: http://design-dna.corp.adobe.com
[dna-opendev-link]: https://wiki.corp.adobe.com/display/AdobeDesign/Spectrum+Developer+Docs
[sdl-jira-link]: https://jira.corp.adobe.com/browse/SDL
[dna-jira-link]: https://jira.corp.adobe.com/browse/DNA
[dev-docs-link]: https://wiki.corp.adobe.com/display/AdobeDesign/Spectrum+Developer+Docs
[forking-link]: https://help.github.com/articles/fork-a-repo/
