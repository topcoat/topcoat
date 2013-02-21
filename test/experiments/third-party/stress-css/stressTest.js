var stressTest = (function () {
    var baselineName = '__STRESSTESTBASELINE__',
    whitespace = /\s+/,
    Object_keys = Object.keys || function (obj) {
        var ret = [];
        for (var i in obj) if (obj.hasOwnProperty(i)) ret.push(i);
        return ret;
    },
    forEach = Array.prototype.forEach || function (func) {
        for (var i = 0, ii = this.length; i < ii; i++) {
            func.call(this, this[i], i, this);
        }
    },
    filter = Array.prototype.filter || function (func) {
        var ret = [];
        forEach.call(this, function (ii) {
            if (func(ii)) ret.push(ii);
        });
        return ret;
    }, indexOf = Array.prototype.indexOf || function(item){
        for(var i = 0, ii = this.length; i<ii; i++){
          if(this[i]===item)
            return i;
        }
        return -1;
    };

    function style(elm, props){
      forEach.call(Object_keys(props),
        function (ii) {
          try {
            var name = ii.replace(/\-([a-z])/ig, function(a, l){ return l.toUpperCase() });
            var value = props[ii];
            elm.style[name] = typeof value == 'number' && name != 'zIndex' ? (value + 'px') : value;
          } catch(x) { }
        }
      );
    }

    function indexElements(state) {
        var all = state.all || getChildren(document), ret = {};
        forEach.call(all, function (elm) {
            if (elm.className && !elm.toString().match(/svg/i)) {
              forEach.call(
                  filter.call(elm.className.split(whitespace), function (n) { return n.length > 0; }),
                  function (n) {
                      if (!ret['.'+n]) ret['.'+n] = [];
                      ret['.'+n].push(elm);
                  });
            } else if(elm.id) {
              if (!ret['#'+elm.id]) ret['#'+elm.id] = [];
                ret['#'+elm.id].push(elm);
            }
        });

        return ret;
    }

    function getChildren(elm, tagName) {
        if(!tagName) tagName = '*';
        if (typeof elm.length != 'undefined') {
            var all = []; //, ret = [], hash = {};
            forEach.call(elm, function (ii) {
                forEach.call(getChildren(ii, tagName), function(ce){
                  all.push(ce);
                });
            });

            //need a way to make sure the list is distinct
            return all; //ret;
        }

        var tags = tagName.split(' ');
        if(tags.length > 1){
          var all = [];
          forEach.call(tags, function (ii) {
            forEach.call(getChildren(elm, ii), function(ce){
              all.push(ce);
            });
          });

          return all;
        }

        return elm.all && tagName == '*' ? elm.all : elm.getElementsByTagName(tagName);
    }

    /*var l = 0;
    function log(){
      var args = [l++];
      args.push.apply(args, arguments);
      console.log.apply(console, args);
    }*/

    //var fid = 0;
    function bind(elm, name, func) {
        var parts = name.split('.'),
          _func = !elm.attachEvent ? func : function(){ func.call(elm, window.event); };
        if (!elm.__events) elm.__events = {};
        if (!elm.__events[name]) elm.__events[name] = [];

        //if(!func.id) func.id = fid++;
        //log('binding',parts, func, func.id);
        elm.__events[name].push(_func);
        if (elm.attachEvent) elm.attachEvent('on' + parts[0], _func);
        else if (elm.addEventListener) elm.addEventListener(parts[0], _func, true);
    }

    function unbind(elm, name, func) {
        if (!func && elm.__events && elm.__events[name]) {
            var evnts = [], existing = elm.__events[name];
            evnts.push.apply(evnts, existing);
            existing.slice(existing.length);
            forEach.call(evnts, function (ii) {
                unbind(elm, name, ii);
            });
        } else {
            var parts = name.split('.');
            if (elm.detachEvent) elm.detachEvent('on' + parts[0], func);
            else if (elm.removeEventListener) {
              //log('unbinding', parts, func, func.id);
              elm.removeEventListener(parts[0], func, true);
            }
            if (elm.__events && elm.__events[name]) {
                var i = indexOf.call(elm.__events[name], func);
                if (i > -1) elm.__events[name].splice(i, 1);
            }

        }
        elm = null;
    }

    function removeClass(elms, className) {
        forEach.call(elms, function (ii) {
            if(!ii) return;
            ii.className = distinct(
                    filter.call(
                        (ii.className || '').split(whitespace),
                        function (jj) { return jj != className; }
                    )
                ).join(' ');
        });
    }

    function distinct(arr) {
        var hash = {};
        forEach.call(arr, function (ii) {
            hash[ii] = true;
        });
        return Object_keys(hash);
    }

    function addClass(elms, className) {
        forEach.call(elms, function (ii) {
            if(!ii) return;
            var classes = (ii.className || '').split(' ');
            classes.push(className);
            ii.className = distinct(classes).join(' ');
        });
    }

    function removeSelector(elms, selector){
      var which = selector.substr(0, 1);
      selector = selector.substr(1);
      if(which === '.') removeClass(elms, selector);
      else if(which === '#') forEach.call(elms, function(elm){ elm.attributes.removeNamedItem('id'); });
    }

    function addSelector(elms, selector){
      var which = selector.substr(0, 1);
      selector = selector.substr(1);
      if(which === '.') addClass(elms, selector);
      else if(which === '#') forEach.call(elms, function(elm){ elm.id = selector; });
    }

    function testSelector(selector, state, finished) {
        var elms = state.elms[selector] || [];
        removeSelector(elms, selector);
        if(state.beforeTest) state.beforeTest({ elms: elms, selector: selector });
        stress(state, state.times, function (time) {
            addSelector(elms, selector);
            if (selector == baselineName) {
                state.baseTime = time;
            } else {
                state.results[selector] = {
                    length: elms.length,
                    children: getChildren(elms).length,
                    time: time,
                    delta: time - state.baseTime
                };
                if(state.afterTest) {
                  state.afterTest({ elms: elms, selector: selector, result: state.results[selector] });
                }
            }
            finished(selector, time);
        });
    }

    function stress(state, times, finish) {
        var now = +new Date,
          lock = false,
          work = state.work || function () {
              lock = false;
              window.scrollTo(0, times % 2 === 0 ? 100 : 0);
              //log(times, 'scrolling', times % 2 === 0 ? 'down' : 'up');
          };
        times *= 2; //each test consists of scrolling down, and then back up

        bind(window, 'scroll.stressTest', function () {
            if(lock) return; //prevent multiple events
            lock = true;
            if (--times > 0 && !state.cancel) {
                //log('again!');
                setTimeout(work, 0);
            } else {
                setTimeout(function(){
                  //Safari can't unbind from within the bound function
                  unbind(window, 'scroll.stressTest');
                  finish((+new Date) - now);
                }, 0);
            }
        });

        work();
    }

    function extend (a, b, copy) {
      b = b || {};
      forEach.call(Object_keys(a), function(key){
        if(copy || !b.hasOwnProperty(key))
          b[key] = a[key];
      });
      return b;
    }

    function stressTest(state) {
        state = extend({
          times: 0, beforeTest: null, afterTest: null,
          elms: indexElements(state.all), results: {}, finish: null
        }, state);

        //the first test scrolls down
        window.scrollTo(0, 0);

        var queue = state.queue = Object_keys(state.elms),
            testfinish = function (className, time) {
                if (queue.length > 0 && !state.cancel) {
                    testSelector(queue.shift(), state, testfinish);
                } else {
                    unbind(document, 'keydown.stressTest');
                    if (state.finish) state.finish();
                }
            };

        bind(document, 'keydown.stressTest', function (e) {
            if (e.keyCode == 27) state.cancel = true;
        });

        /* figure out how many tests to run */
        state.times = 15;
        testSelector(baselineName, state, function (c, time) {
            state.times = Math.round(15*3/time*750); //each selector should take at least 750ms*3 to run
            testSelector(baselineName, state, testfinish);
        });
    }

    function formatNumber(number, leading, trailing){
      leading = leading || 0;
      trailing = trailing || 2;
      var parts = (number+'.').split('.');
      while(parts[0].length<leading) parts[0] = '0' + parts[0];
      if(trailing < 1) parts[1] = '';
      else if(parts[1].length > trailing) parts[1] = parts[1].substr(0, trailing);
      else while(parts[1].length < trailing) parts[1] += '0';
      return parts[0] + (parts[1].length > 0 ? ('.' + parts[1]) : '');
    }

    function showReport(state, report){
        var log = '<table><thead><tr><th>Selector</th><th># Elms.</th><th># Child.</th><th> </th><th>Delta</th><th>Total</th></tr></thead>',
            all = Object_keys(state.results),
            worst = all.sort(function (a, b) {
                return state.results[a].time - state.results[b].time;
            }).slice(0, 20);

        var limit = 3;
        var results = {};
        results.selector = [];
        forEach.call(worst, function (ii) {
            if(--limit >= 0) {
              results.selector.push({
                'selector' : ii,
                'delta' : formatNumber(Math.abs(state.results[ii].delta)/state.times),
                'total' : formatNumber(state.results[ii].time/state.times)
              });
            }
            log += '<tr><td>Removing <strong style="font:12px monospace">' + ii +
                '</strong></td><td style="text-align:right; font:12px monospace">' + state.results[ii].length + '</td><td style="text-align:right; font:12px monospace">' + state.results[ii].children +
                '</td><td style="text-align:right">' + (state.results[ii].delta < 0 ? '<span style="color:red">saves</span>' : '<span style="color:green">adds</span>') +
                '</td><td style="text-align:right; font:12px monospace">' + formatNumber(Math.abs(state.results[ii].delta)/state.times) + 'ms</td><td style="text-align:right; font:12px monospace">' +
                formatNumber(state.results[ii].time/state.times) + 'ms</td></tr>\n';
        });
        log += '</table><hr/><table><tr><td style="text-align:right">Selectors Tested:</td><td style="font:12px monospace">' + all.length + '</td></tr>' +
          '<tr><td style="text-align:right">Baseline Time:</td><td style="font:12px monospace">' + formatNumber(state.baseTime/state.times) + 'ms</td></tr>' +
          '<tr><td style="text-align:right">Num. Tests:</td><td style="font:12px monospace">' + state.times + '</td></tr>';

        results.noSelectors = all.length;
        results.baselineTime = formatNumber(state.baseTime/state.times);
        results.numTests = state.times;

        console.log(results);
        window.results = results;

        if(filter.call(all, function(cn){
          return state.results[cn].time <= 15;
        }).length) {
          log += '<tr><td style="color:red; text-align:right;font-weight:bold">Warning:</td><td>Increase the number<br />of tests to get more<br />accurate results</td></tr>';
        }

        report.innerHTML = log + '</table>';
        forEach.call(
          getChildren(report, 'td th'),
          function (td) {
            style(td, {
              padding: 1,
              verticalAlign: 'top',
              whiteSpace: 'nowrap',
              fontSize: 12
            });
          }
        );
    }

    stressTest.bind = bind;
    stressTest.unbind = unbind;
    stressTest.bookmarklet = function () {
        if(stressTest.report) stressTest.report.close();

        //var num = prompt('How many tests would you like to run (# stress tests per selector)?', 5);
        //if (num > 0) {
            var  reportHolder = document.createElement('iframe'),
            block = document.createElement('iframe');
            extend({
              //name: 'report' + Math.random().toString().substr(2),
              scrolling: 'no',
              frameBorder: 'no'
            }, reportHolder, true);
            document.body.appendChild(reportHolder);
            reportHolder.doc = reportHolder.contentDocument || reportHolder.contentWindow.document;
            reportHolder.doc.write('<html><head></head><body></body></html>');
            reportHolder.doc.close();

            var report = reportHolder.doc.createElement('div'),
              close = reportHolder.doc.createElement('a'),
              state = {
                //times: num,
                finish: function(){
                  if(this.cancel) reportHolder.close();
                  else showReport(this, report);
                  console.log('finished testing all');
                },
                beforeTest: function(e) {
                  console.log('testing a new css selector');
                  var l = this.queue.length;
                  report.innerHTML = 'Testing <strong>' + e.selector +
                    '</strong><br/>' + l + ' test' + (l===1?'':'s') + ' remain';
                },
                all: getChildren(document)
              };

            reportHolder.resize = function(){
              var body = reportHolder.doc.body;
              style(reportHolder, {
                width: body.scrollWidth,
                height: body.scrollHeight
              });
            }
            setInterval(reportHolder.resize, 100);

            var zIndex = 0;
            forEach.call(state.all, function(elm){
              var z = parseInt(elm.style.zIndex, 10);
              if(!isNaN(z) && z > zIndex) zIndex = z;
            });
            zIndex += 99999;
            style(reportHolder, {
              position: 'fixed', top: 10, right: 10,
              zIndex: zIndex,
              background: 'white', padding: 2,
              border: 'solid 2px #aaa',
              width: 200, height: 40,
              borderRadius: 4, boxShadow: '0 0 8px #eee'
            });
            style(reportHolder.doc.body, {
              'font': '12px Helvetica,Arials,sans-serif',
              color: '#444'
            });
            style(report, { whiteSpace: 'nowrap' });

            close.innerHTML = '&#215;';
            style(close, {
              position: 'absolute', top: 0, right: 0,
              textDecoration: 'none', fontWeight: 'bold',
              cursor: 'pointer', color: 'red',
              fontSize: '1.3em', lineHeight: 8
            });
            reportHolder.close = function(){
              reportHolder.parentNode.removeChild(reportHolder);
              block.parentNode.removeChild(block);
              unbind(close, 'click');
              stressTest.report = null;
              state.cancel = true;
            };
            bind(close, 'click', reportHolder.close);

            style(block, {
              height: window.screen.height * 2,
              width: window.screen.width,
              position: 'absolute', top: 0, left: 0,
              visible: 'hidden',
              zIndex: zIndex - 1
            });
            document.body.appendChild(block);

            reportHolder.doc.body.appendChild(close);
            reportHolder.doc.body.appendChild(report);
            stressTest.report = reportHolder;

            stressTest(state);

        //}
    }

    return stressTest;
})();