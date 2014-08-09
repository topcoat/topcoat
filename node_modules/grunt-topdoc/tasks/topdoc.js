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


module.exports = function(grunt) {
    'use strict';

    var Topdoc = require('topdoc');

    grunt.registerMultiTask('topdoc', 'Generates a usage guide using Topdoc from a commented css file', function() {

        var options = this.options({}),
            topdoc = new Topdoc(options);

        var done = this.async();

        //TODO: Errors?
        var callback = function(){
            grunt.log.writeln('Generated usage guides at ' + options.destination);
            done();
        };
        topdoc.generate(callback.bind(options));
    });
};
