/*!
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

        var commit
        ,   date
        ,   parser = new UAParser()
        ,   ua = parser.getResult()
        ,   device = ""
        ;
        
        for(var i in ua.device) // if there is any, usually works on mobile
            if(ua.device[i]) device += ua.device[i] + ' ';

        device = device.trim();

        $('.topcoat-version').on('keyup', function () {
            var val = $(this).val().trim().split(' ');
            commit = val.shift();
            date = val.join(' ');
            if(commit.length == 40 && date.length) {
                if(Date.parse(date)) {
                    $('input[type=checkbox]').attr('disabled', false).attr('checked', 'true');
                    $('#submit').attr('disabled', false);
                    $('#page-load-time').attr('disabled', false);
                }
                else
                    alert('Invalid Date');
            }
        });

        $('#submit').on('click', function () {
            console.log('submit stress css results');
            var results = window.results;
            $.post("http://topcoat.herokuapp.com/stressCSS", {
            // $.post("http://localhost:3000/benchmark", {
              benchmark_result: results.baselineTime,
              commit: commit,
              date: date,
              selector: results.selector,
              device: device,
              ua: navigator.appVersion,
              test: 'stressCSS'
            }).success(function(data){
              console.log(data);
            });

        });