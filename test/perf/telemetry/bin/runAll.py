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
#  - TestHelper.CHROMIUM_SRC: path to chromium src
#  - DEVICE_NAME: a label to identify the machine running the tests when submitting results
#  - CEF_HOME: path to CEF binaries (needed only if USE_CEF is set to True)
#  - USE_CEF: if run with CEF, set this to 'True'
#

import os
import sys
import shutil
import subprocess
import glob
import platform
import shutil


class TestHelper():
    GRUNT        = "grunt"
    RESULTS_DIR  = "/tmp/topcoat-telemetry"
    BROWSER	     = "system"
    BROWSER_EXEC = None
    SUBMIT_TYPE  = "SHA"
    
    CHROMIUM_SRC = os.environ.get("CHROMIUM_SRC")
    DEVICE_NAME  = os.environ.get("DEVICE_NAME")
    CEF_HOME     = os.environ.get("CEF_HOME")
    USE_CEF      = os.environ.get("USE_CEF")
    
    @staticmethod
    def init(targetPlatform, targetTheme):
        TestHelper._checkEnvVars()
        TestHelper._prepareProperties()
        TestHelper._prepareResultsDir()
        TestHelper._cleanTelemetryTests()
        TestHelper._prepareTelemetryTests(targetPlatform, targetTheme)
    
    @staticmethod
    def _getPlatform():
        p = platform.platform().lower()
        if p.find('windows') != -1: return "Win"
        if p.find('darwin')  != -1: return "Mac"
        if p.find('linux')   != -1: return "Lin"
    
    @staticmethod
    def _checkEnvVars():
        if not TestHelper.DEVICE_NAME:
            raise RuntimeError("Please set DEVICE_NAME env var (no spaces allowed yet)")
        
        if not TestHelper.CHROMIUM_SRC:
            raise RuntimeError("Please set CHROMIUM_SRC env var.")
        
        if not TestHelper.USE_CEF:
            raise RuntimeError("Please set USE_CEF env var.")
        
        if (TestHelper.USE_CEF == 'True') and (not TestHelper.CEF_HOME):
            raise RuntimeError("Please set CEF_HOME if you set USE_CEF to True")
    
    @staticmethod
    def _prepareProperties():
        p = TestHelper._getPlatform()
        
        if p == "Win":
            TestHelper.GRUNT = "grunt.cmd"
            TestHelper.RESULTS_DIR = "C:\\tmp\\topcoat-telemetry"
            TestHelper.BROWSER = "exact"
            TestHelper.BROWSER_EXEC = "%s\\app\\cefclient.exe" % TestHelper.CEF_HOME
        
        if p == "Mac":
            if TestHelper.USE_CEF:
                TestHelper.BROWSER = "exact"
                TestHelper.BROWSER_EXEC = "%s/app/cefclient.app/Contents/MacOS/cefclient" % TestHelper.CEF_HOME
        
        if p == "Lin":
            TestHelper.BROWSER = "android-chrome-beta"
    
    @staticmethod
    def _prepareResultsDir():
        print "runAll.py: Preparing results dir %s" % TestHelper.RESULTS_DIR
        if os.path.isdir(TestHelper.RESULTS_DIR):
            shutil.rmtree(TestHelper.RESULTS_DIR)
        os.makedirs(TestHelper.RESULTS_DIR)
    
    @staticmethod
    def _prepareTelemetryTests(targetPlatform, targetTheme):
        print "runAll.py: Preparing telemetry tests"
        subprocess.check_call([TestHelper.GRUNT, 'telemetry:'+targetPlatform+':'+targetTheme])

    @staticmethod
    def _cleanTelemetryTests():
        print "runAll.py: clean up CHROMIUM_SRC/tools/perf/page_sets/topcoat"
        path = TestHelper.CHROMIUM_SRC + "tools/perf/page_sets/topcoat"
        if os.path.exists(path):
            shutil.rmtree(path)
    
    @staticmethod
    def runTests(user_defined_test_list, how_many_rounds_to_run_the_test):
        print "runAll.py: Running telemetry tests, results in %s" % TestHelper.RESULTS_DIR
        
        telemetry_tests = ["loading_benchmark", "smoothness_benchmark"]

        if user_defined_test_list and len(user_defined_test_list) != 0:
            topcoat_test_files = user_defined_test_list
        else:
            topcoat_test_files = glob.glob(os.getcwd() + "/../perf/page_sets/*.json")

        def genCmd():
            cmd = [
                   "python",
                   TestHelper.CHROMIUM_SRC + "/tools/perf/run_multipage_benchmarks",
                   "--browser=" + TestHelper.BROWSER,
                   telemetry_test,
                   TestHelper.CHROMIUM_SRC + "tools/perf/page_sets/%s" % topcoat_test_file,
                   "-o", TestHelper.RESULTS_DIR + "/%s_%s-%s.txt" % (telemetry_test, topcoat_test_name, test_round)
                   ]
            if TestHelper.BROWSER_EXEC:
                cmd.insert(3, "--browser-executable=" + TestHelper.BROWSER_EXEC)
            return cmd

        for tf in topcoat_test_files:
            topcoat_test_file = tf.split(os.sep)[-1]
            topcoat_test_name = topcoat_test_file.split(".")[0]
            print "runAll.py: Running tests for %s" % topcoat_test_name

            for telemetry_test in telemetry_tests:
                for test_round in range(how_many_rounds_to_run_the_test):
					cmd = genCmd()
					subprocess.check_call(cmd)
    
    @staticmethod
    def submitResults(git_cwd):
        print "runAll.py: Pushing telemetry data to the server"
        result_files = glob.glob(TestHelper.RESULTS_DIR + "/*.txt")
        for rf in result_files:
			subprocess.check_call([
                             TestHelper.GRUNT,
                             "telemetry-submit:" + git_cwd,
                             "--path="   + rf,
                             "--device=" + TestHelper.DEVICE_NAME,
                             "--test="   + rf.split(os.sep)[-1][:-6],
                             "--type="   + TestHelper.SUBMIT_TYPE
                             ])


if __name__ == "__main__":

    # Usage:
	# ./python runAll.py --platform=VALUE --theme=VALUE [--gitCWD=VALUE] [--test=VALUE] [--round=VALUE]
    #	--platform= desktop or mobile
	#	--theme= light or dark
	#	[optional] --gitCWD=PATH_WHERE_YOU_WANT_TO_RUN_GIT_LOG, e.g. src/skins/button
	#	[optional] --test=ONE_OR_MORE_TESTS_YOU_WANT_TO_RUN, e.g. topcoat_button.test.json
	#	[optional] --test=HOW_MANY_ROUNDS_TO_RUN_THE_TEST, default is 1.

    platfrm = theme = git_cwd = test_list = None
    test_round = 1

    args = sys.argv[1:]

    for arg in args:
        arg_key, arg_val = arg.split('=')
        if arg_key == '--platform':
            platfrm = arg_val
        elif arg_key == '--theme':
            theme = arg_val
        elif arg_key == '--gitCWD':
            git_cwd = arg_val
        elif arg_key == '--test':
            test_list = arg_val.split(',')
        elif arg_key == '--round':
            test_round = int(arg_val)
        else:
            print "%s is not recognized."

    if not platform or not theme:
        raise RuntimeError("ERROR: --platform and --theme must be set.")

    if not git_cwd:
        git_cwd = ''

    TestHelper.init(platfrm, theme)
    TestHelper.runTests(test_list, test_round)
    TestHelper.submitResults(git_cwd)