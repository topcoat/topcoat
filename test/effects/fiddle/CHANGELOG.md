== HEAD

== 4.0.0

* Update to Normalize.css 2.0.1 (#127).
* Separate Normalize.css from the rest of the CSS.
* Replace jQuery with Zepto.js as default (#11).
* Update HiDPI example media query.
* Various bug fixes to `MBP.fastButton` (#126, #116).
* Add `MBP.startupImage` helper for apple web app startup images.
* Add `MBP.preventScrolling` helper to prevent default scrolling on document window.
* Update to Modernizr 2.6.1.
* Add bundled docs (#125).
* Add CHANGELOG.md (#129).
* Add MIT License.
* Code format and consistency changes.

== 3.0.0

* Remove `initial-scale=1.0` from meta.
* Exclude `scalefix` by default.
* Update startup tablet landscape dimensions.
* Added `lang` attr.
* Remove `meta` author.
* Add `MBP.enableActive`.
* Fix `MBP.hideUrlBar()` when addEventListener is undefined.
* Prevent iOS from zooming on focus.
* Work around a tricky bug in Android 2.3 to `MBP.fastButton`.
* Remove Respond.js.
* Split `hideUrlBar` into an intial function, and a general use function cached the scrollTop so that only needs to be detected once.
* Move `helper.js` one level up.
* Update jQuery to 1.7.1 and added missing fallback local file.
* Update Modernizr to the latest version.
* Add iPod (Touch) to `MBP.scaleFix`.
* Remove `input::-moz-focus-inner` as it is not required on Firefox on Mobile.
* Remove the ellipsis helper class.
* Remove the build script.
* Update 404 page to be consistent with HTML5 Boilerplate.
* Remove `demo/` and `test/`.
* Remove analytics and wspl.
