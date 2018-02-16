# Contributing

We love pull requests from everyone.

Star by [forking](https://help.github.com/articles/fork-a-repo/) the repo, then [clone](https://help.github.com/articles/cloning-a-repository/) your fork:

```
git clone git@github.com:yourusername/spectrum-css.git
```

Set up a branch for your feature or bug fix, push it to your fork, and set up a remote for the upstream repo:

```
git checkout -b my-awesome-new-feature
git push -u origin my-awesome-new-feature
git remote add upstream git@git.corp.adobe.com:Spectrum/spectrum-css.git
```

Set up the `@spectrum` npm namespace in your `.npmrc`

```
echo "@spectrum:registry=https://artifactory.corp.adobe.com:443/artifactory/api/npm/npm-spectrum-release/" >> ~/.npmrc
```

Install dependencies:

```
npm install
```

Make sure the [gulp-cli](https://github.com/gulpjs/gulp-cli) is installed globally:

```
npm install -g gulp-cli
```

Build the project, open a livereloading browser window, and watch for changes:

```
gulp dev
```

Commit changes, refercing the relevant issue number (if any):

```
git commit -m "Cool stuff, closes #250, fixes #252"
```

Consider starting the commit message with an applicable emoji:

* :art: `:art:` when improving the format/structure of the code
* :zap: `:zap:` when improving performance
* :non-potable_water: `:non-potable_water:` when plugging memory leaks
* :memo: `:memo:` when writing docs
* :ambulance: `:ambulance:` a critical hotfix.
* :sparkles: `:sparkles:` when introducing new features
* :bookmark: `:bookmark:` when releasing / version tags
* :rocket: `:rocket:` when deploying stuff
* :penguin: `:penguin:` when fixing something on Android
* :apple: `:apple:` when fixing something on iOS
* :checkered_flag: `:checkered_flag:` when fixing something on Windows
* :bug: `:bug:` when fixing a bug
* :fire: `:fire:` when removing code or files
* :green_heart: `:green_heart:` when fixing the CI build
* :white_check_mark: `:white_check_mark:` when adding tests
* :lock: `:lock:` when dealing with security
* :arrow_up: `:arrow_up:` when upgrading dependencies
* :arrow_down: `:arrow_down:` when downgrading dependencies
* :shirt: `:shirt:` when removing linter warnings
* :hammer: `:hammer:` when doing heavy refactoring
* :heavy_minus_sign: `:heavy_minus_sign:` when removing a dependency.
* :heavy_plus_sign: `:heavy_plus_sign:` when adding a dependency.
* :wrench: `:wrench:` when changing configuration files.
* :globe_with_meridians: `:globe_with_meridians:` when dealing with internationalization and localization.
* :pencil2: `:pencil2:` when fixing typos.
* :hankey: `:hankey:` when writing bad code that needs to be improved.
* :package: `:package:` when updating compiled files or packages.

Make sure your branch is up to date with the original repo:

```
git fetch upstream
git merge upstream/master
```

Review your changes and any possible conflicts and push to your fork:

```
git push origin
```

[Submit a pull request](https://help.github.com/articles/creating-a-pull-request/).

At this point you're waiting on us. We do our best to keep on top of all the pull requests. We may suggest some changes, improvements or alternatives.

Some things that will increase the chance that your pull request is accepted:

- Write a [good commit message](http://chris.beams.io/posts/git-commit/).
- Make sure the PR merges cleanly with the latest master.
- Describe your feature/bugfix and why it's needed/important in the pull request description.
