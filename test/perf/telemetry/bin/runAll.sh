#!/bin/sh
# Copyright 2012 Adobe Systems Inc.;
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# Runs all the telemetry tests and pushes results to the server
#
# Make sure to run in from its folder!
#
# Env vars used: 
#  - CHROMIUM_SRC: path to chromium src
#  - DEVICE_NAME: a label to identify the machine running the tests when submitting results
#  - CEF_HOME: path to CEF binaries (needed only if USE_CEF is set to True)
#

RESULTS_DIR=/tmp/topcoat-telemetry
USE_CEF=true

function checkEnvVars() {
    if [ -z "$DEVICE_NAME" ] 
    then
        echo "Please set DEVICE_NAME env var (no spaces allowed yet)"
        exit 1
    fi

    if [ -z "$CHROMIUM_SRC" ]
    then
        echo "Please set CHROMIUM_SRC env var"
        exit 1
    fi
    
    if ($USE_CEF) 
    then
        if [ -z "$CEF_HOME" ] 
        then
            echo "You need to set CEF_HOME if yout set USE_CEF to True"
            exit 1
        fi
    fi    
}

function prepareResultsDir() {
    echo "runAll.sh: Preparing results dir $RESULTS_DIR"
    rm -rf $RESULTS_DIR
    mkdir $RESULTS_DIR    
}

function prepareTelemetryTests() {
    echo "runAll.sh: Preparing telemetry tests"
    grunt telemetry    
}

function runTests() {
    echo "runAll.sh: Running telemetry tests, resuls in $RESULTS_DIR"

    if ($USE_CEF)
    then
        browserParams="--browser=exact --browser-executable=$CEF_HOME/app/cefclient.app/Contents/MacOS/cefclient" 
    else
        browserParams="--browser=system"
    fi

    testFiles=$(ls ../perf/page_sets/*.json);

    currentDir=`pwd`
    cd $CHROMIUM_SRC/tools/perf

    for test in $testFiles
    do
        testFileBaseName=$(basename $test) #ends with .json
        testName=$(echo $testFileBaseName | cut -d '.' -f 1)
        echo "runAll.sh: Running tests for $testName"
        ./run_multipage_benchmarks $browserParams loading_benchmark page_sets/$testFileBaseName -o $RESULTS_DIR/loading_benchmark_$testName.txt
        ./run_multipage_benchmarks $browserParams smoothness_benchmark page_sets/$testFileBaseName -o $RESULTS_DIR/smoothness_benchmark_$testName.txt
    done
    
    cd $currentDir
}

function submitResults() {
    echo "runAll.sh: Pushing telemetry data to the server"

    for resultFile in $RESULTS_DIR/* 
    do
        grunt telemetry-submit --path=$resultFile --device $DEVICE_NAME   
    done    
}


checkEnvVars
prepareResultsDir
prepareTelemetryTests
runTests
submitResults

