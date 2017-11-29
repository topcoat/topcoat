/*eslint-disable no-unused-vars*/

'use strict';

// Polyfill closest() on IE 11
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    var ancestor = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (ancestor.matches(s)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return null;
  };
}

function changeCSS(colorStop) {
  document.body.className = 'spectrum spectrum--'+colorStop;
}

function openDialog(dialog, withOverlay) {
  if (withOverlay !== false) {
    document.getElementById('spectrum-underlay').classList.add('is-open');
  }

  dialog.classList.add('is-open');
}

function closeDialog(dialog) {
  document.getElementById('spectrum-underlay').classList.remove('is-open');
  dialog.classList.remove('is-open');
}

document.addEventListener('DOMContentLoaded', function(event) {
  changeCSS('light');
});

// Show and hide code samples
function toggleMarkupVisibility(event) {
  event.preventDefault();
  var exampleMarkup = event.target.closest('.sdldocs-component').querySelector('.sdldocs-code-example');
  var style = window.getComputedStyle(exampleMarkup);
  var isHidden = style.getPropertyValue('display') === 'none';
  event.target.innerHTML = isHidden ? 'hide markup' : 'show markup';
  exampleMarkup.style.display = isHidden ? 'block' : 'none';
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('sdldocs-code-link')) {
    toggleMarkupVisibility(event);
  }
});

AdobeSpectrum.loadIcons('../icons/spectrum-css-icons.svg');
AdobeSpectrum.loadIcons('../icons/spectrum-icons.svg');
