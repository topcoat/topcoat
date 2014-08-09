/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
(function() {
  "use strict";

  var Topdocument, cssParse, fs, path, read, yaml, topdocutils, tidy;

  fs = require('fs');

  cssParse = require('css-parse');

  path = require('path');

  read = fs.readFileSync;

  yaml = require('js-yaml');

  topdocutils = require('./topdocutils');

  Topdocument = (function() {
    function Topdocument(sourcePath, template) {
      this.sourcePath = sourcePath;
      this.template = template || path.join('lib', 'template.jade');
      this.cssParseResults = this.cssParse();
      this.results = this.topdocParse();
    }

    Topdocument.prototype.cssParse = function() {
      this.source = read(this.sourcePath, 'utf8');
      var cssParseResult;
      try {
        cssParseResult = cssParse(read(this.sourcePath, 'utf8'), { position: true });
      } catch (err) {
        console.error(err);
      }
      return cssParseResult;
    };

    Topdocument.prototype.topdocParse = function() {
      var filename, basename, name_array, component, css, cssLines, details, endCSSPos, example, examples, html, i, listItem, name, nextItem, results, rules, sourceLines, startCSSPos, _i, _j, _k, _len, _len1, _ref, _ref1,example_set;
      sourceLines = this.source.split(/\n/g);
      this.validRegEx = /^ ?topdoc/;
      filename = path.basename(this.sourcePath);
      basename = filename.substring(0, filename.length - path.extname(filename).length);
      name_array = basename.split('-');
      results = {
        title: topdocutils.titlify(path.basename(this.sourcePath)),
        filename: filename,
        source: this.sourcePath,
        template: this.template,
        components: []
      };
      if(name_array.length == 3){
        results.theme = name_array[2];
        results.set = name_array[1];
      }
      rules = this.cssParseResults.stylesheet.rules;
      for (i = _i = 0, _len = rules.length; _i < _len; i = ++_i) {
        listItem = rules[i];
        if (this.isValidComment(listItem)) {
          startCSSPos = listItem.position.end;
          endCSSPos = null;
          for (nextItem = _j = _ref = i + 1, _ref1 = rules.length; _j <= _ref1; nextItem = _j += 1) {
            if (this.isValidComment(rules[nextItem])) {
              endCSSPos = rules[nextItem].position.start;
              break;
            }
          }
          if (endCSSPos) {
            cssLines = sourceLines.slice(startCSSPos.line, endCSSPos.line - 1);
          } else {
            cssLines = sourceLines.slice(startCSSPos.line);
          }
          css = cssLines.join('\n');
          listItem.comment = listItem.comment.replace(this.validRegEx, '');

          component = yaml.load(listItem.comment);
          component.markup = this.parseMarkup(listItem.comment);
          component.css = css;
          component.slug = topdocutils.slugify(component.name);
          results.components.push(component);
        }
      }
      return results;
    };
    Topdocument.prototype.parseMarkup = function(comment) {
      var markup, commentEnd, indent;
      markup = comment;
      markup = markup.substring(markup.search(/markup:/)+7);
      commentEnd = markup.search(/\s\w+:/);
      commentEnd = (commentEnd >= 0)? commentEnd: markup.length;
      markup = markup.substring(0, commentEnd);
      markup = markup.replace(/(\r|\n)/m, '');
      markup = markup.replace(/\n/g, '\r');
      indent = markup.substring(0, markup.search(/\S/));
      markup = markup.split('\r'+indent).join('\r');
      markup = markup.trim();
      return markup;
    };
    Topdocument.prototype.isValidComment = function(comment) {
      var commentMatch;
      if (comment && comment.type === "comment") {
        commentMatch = this.validRegEx.exec(comment.comment);
        if (commentMatch) {
          return true;
        }
      }
      return false;
    };

    return Topdocument;

  })();

  module.exports = Topdocument;

}).call(this);
