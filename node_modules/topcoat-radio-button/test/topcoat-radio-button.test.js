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

describe('Topcoat radio-button', function() {
    'use strict';

    it('should output correct desktop dark css', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-desktop-dark.css');
        var expected = grunt.file.read('test/expected/topcoat-radio-button-desktop-dark.css');
        assert.equal(actual, expected, 'should generate correct css');
    });

    it('should output correct desktop light css', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-desktop-light.css');
        var expected = grunt.file.read('test/expected/topcoat-radio-button-desktop-light.css');
        assert.equal(actual, expected, 'should generate correct css');
    });

    it('should output correct mobile dark css', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-mobile-dark.css');
        var expected = grunt.file.read('test/expected/topcoat-radio-button-mobile-dark.css');
        assert.equal(actual, expected, 'should generate correct css');
    });

    it('should output correct mobile light css', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-mobile-light.css');
        var expected = grunt.file.read('test/expected/topcoat-radio-button-mobile-light.css');
        assert.equal(actual, expected, 'should generate correct css');
    });

    it('should not have any unrendered variables desktop dark', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-desktop-dark.css');
        assert.equal(actual.match(/var-[a-z-]*[a-z]+/g), null, 'should not have missing vars');
    });
    it('should not have any unrendered variables desktop light', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-desktop-light.css');
        assert.equal(actual.match(/var-[a-z-]*[a-z]+/g), null, 'should not have missing vars');
    });
    it('should not have any unrendered variables mobile dark', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-mobile-dark.css');
        assert.equal(actual.match(/var-[a-z-]*[a-z]+/g), null, 'should not have missing vars');
    });
    it('should not have any unrendered variables mobile light', function() {
        var actual = grunt.file.read('css/topcoat-radio-button-mobile-light.css');
        assert.equal(actual.match(/var-[a-z-]*[a-z]+/g), null, 'should not have missing vars');
    });

});

