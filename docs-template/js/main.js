/* global Typekit */
/* jshint -W033,-W116 */
(function(window, undefined) {
  "use strict"

  // note: 'ruf7eed' is CoralUI's default kit
  var config = {
    kitId: 'ruf7eed',
    scriptTimeout: 3000
  };

  if (!window.Typekit) { // we load the typescript only once
    var h = document.getElementsByTagName("html")[0];
    h.className += " wf-loading";
    var t = setTimeout(function() {
      h.className = h.className.replace(/(\s|^)wf-loading(\s|$)/g, " ");
      h.className += " wf-inactive";
    }, config.scriptTimeout);
    var tk = document.createElement("script"),
      d = false;

    // Always load over https
    tk.src = 'https://use.typekit.net/' + config.kitId + '.js'
    tk.type = "text/javascript";
    tk.async = "true";
    tk.onload = tk.onreadystatechange = function() {
      var a = this.readyState;
      if (d || a && a !== "complete" && a !== "loaded") {
        return;
      }
      d = true;
      clearTimeout(t);
      try {
        Typekit.load(config);
      } catch (b) {}
    };
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(tk, s);
  }

}(this));

window.onload = function(){
  var showCodeDivs = document.getElementsByClassName('cssdoc-component-example');
  for (var i = showCodeDivs.length - 1; i >= 0; i--) {
    showCodeDivs[i].getElementsByClassName('cssdoc-code-link')[0].onclick = function(e) {
      var element = e.target.parentNode.parentNode.getElementsByClassName('cssdoc-code-example')[0];
      var style = window.getComputedStyle(element);
      if(style.getPropertyValue('display') == 'none'){
        e.target.innerHTML = 'hide markup';
        element.style.display = 'block';

      } else {
        e.target.innerHTML = 'show markup';
        element.style.display = 'none';
      }
      e.target.blur();
      return false;
    };
  };
  // var slideMenuButton = document.getElementById('slide-menu-button');
  // slideMenuButton.onclick = function(e) {
  //  var site = document.getElementById('site');
  //  var cl = site.classList;
  //  if (cl.contains('open')) {
  //    cl.remove('open');
  //  } else {
  //    cl.add('open');
  //  }
  // };
  // var docNavs = document.getElementsByClassName('topdoc-select');
  // for (var j = docNavs.length - 1; j >= 0; j--) {
  //  docNavs[j].onchange = function(e){
  //    window.location.href = e.target[e.target.selectedIndex].value;
  //  };
  // };


  // var pageNav = document.getElementById('pageNav');
  // var pageLinks = pageNav.getElementsByTagName('a');
  // for (var k = pageLinks.length - 1; k >= 0; k--) {
  //   pageLinks[k].onclick = function(e) {
  //     var site = document.getElementById('site');
  //     var cl = site.classList;
  //     if (cl.contains('open')) {
  //       cl.remove('open');
  //     }
  //   };
  // };

}
