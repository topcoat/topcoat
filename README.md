![spectrum-logo](https://git.corp.adobe.com/storage/user/655/files/a13fda74-9d4a-11e6-9aec-1b320823594a)
# spectrum-css
The goal is to support [spectrum][spectrum-link] consumption via web by providing a standard implementation that can be integrated into other libraries.  

For now, there is not a large implementation set, only a few components.  Also, the current dependency on [spectrum/palette](http://git.corp.adobe.com/spectrum/palette) is going to be refactored out.  We are working on a larger system called [DNA][dna-link] and that will supersede palette in the near future.

For questions, or to discuss, join us on [Slack](adobespectrum.slack.com)!

## usage  
You can simply grab a [release](https://git.corp.adobe.com/Spectrum/spectrum-css/releases) of this project if you don't want to build it yourself :)

To build this project, follow the steps below.

If you are contributing, please make a [fork][forking-link] of this repo and [do your work][dev-docs-link] in an [issue specific branch][sds-jira-link].

Once you are ready, you can get started like this:

```sh
git clone git@git.corp.adobe.com:<YOUR_USERNAME>/spectrum-css.git
cd spectrum-css
npm install
npm run build
```

The `dist/` folder will contain all the goodies, including a copy of the [style documentation](http://git.corp.adobe/com/pages/spectrum/spectrum-css/)

## about spectrum, sds, and dna
This repository is part of the [Spectrum Design System][spectrum-link] which is Adobe's unified design language. [Spectrum DNA][dna-link] consists of a set of projects provided by the **Adobe Design Frameworks** team.  Our goal is to support [Spectrum][spectrum-link] consumption by providing source constants, build tools, and implementation support that can be integrated by anyone wanting to conform to the Spectrum Design System.

## open development
We try to work in compliance with some [Open Development][dna-opendev-link] standards.  See our [open development documentation][dna-opendev-link] for details.

## problems?
For questions, discussion, or feedback join us on [Slack][slack-link]!  You can also use the follow mail lists:

#### consumer announcements and general questions
* spectrum-informed@adobe.com
* grp-design-dna-informed@adobe.com

#### contributor questions and design frameworks
* cg-design-dna-contributors@adobe.onmicrosoft.com
* spectrum-core@adobe.com

Thanks - Adobe Design Frameworks

[spectrum-link]: http://spectrum.corp.adobe.com
[slack-link]: https://adobespectrum.slack.com
[dna-link]: http://spectrum-dna.corp.adobe.com
[dna-opendev-link]: http://spectrum-dna.corp.adobe.com/opendevelopment.html
[sds-jira-link]: https://jira.corp.adobe.com/browse/SDS
[dev-docs-link]: https://wiki.corp.adobe.com/display/AdobeDesign/Spectrum+Developer+Docs
[forking-link]: https://help.github.com/articles/fork-a-repo/
