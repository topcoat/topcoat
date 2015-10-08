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
    assert = require('assert');

describe('Topcoat list base', function() {
    'use strict';

    it('should output correct css', function() {
        var actual = grunt.file.read('css/list.css');
        var expected = grunt.file.read('test/expected/list.css').trim();
        assert.equal(actual, expected, 'should generate correct css');
    });

});
