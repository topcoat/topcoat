/**
*
* Copyright 2012 Adobe Systems Inc.;
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

/*global require, describe, it*/

var grunt = require('grunt'),
    assert = require('assert'),
    request = require('request');

var deps = {
    "topcoat-utils": "~0.1.3",
    "topcoat-radio-button-base": "~0.1.1",
    "topcoat-checkbox-base": "~0.1.3",
    "topcoat-input-base": "~0.3.0",
    "topcoat-textarea-base": "~0.2.0",
    "topcoat-button-base": "~0.6.0",
    "topcoat-list-base": "~0.3.0",
    "topcoat-checkbox": "~0.3.4",
    "topcoat-radio-button": "~0.1.1",
    "topcoat-theme": "~0.5.4",
    "topcoat-list": "~0.4.0",
    "topcoat-navigation-bar-base": "~0.4.0",
    "topcoat-navigation-bar": "~0.4.0",
    "topcoat-button": "~0.5.0",
    "topcoat-search-input": "~0.2.0",
    "topcoat-textarea": "~0.2.0",
    "topcoat-text-input": "~0.3.0"
  }

var travis = 'https://travis-ci.org/topcoat/';

describe('Topcoat', function() {
    'use strict';

    for (var i in deps) {

        var repo = i.substring(8,i.length);

        it(repo + ' should pass', function(done) {

            request.get({url: travis + repo + '.json', json: true}, function (err, resp, body) {
                if (err) throw err;
                if (body.last_build_result != 0) throw new Error(repo + ' build failed');
                done();
            });

        });
        
    }

});

