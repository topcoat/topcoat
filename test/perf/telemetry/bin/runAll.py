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
import shutil
import subprocess
import glob
import platform


class TestHelper():
    GRUNT        = "grunt"
    RESULTS_DIR  = "/tmp/topcoat-telemetry"
    BROWSER	     = "system"
    BROWSER_EXEC = None

    CHROMIUM_SRC = os.environ.get("CHROMIUM_SRC")
    DEVICE_NAME  = os.environ.get("DEVICE_NAME")
    CEF_HOME     = os.environ.get("CEF_HOME")
    USE_CEF      = os.environ.get("USE_CEF")

    @staticmethod
    def init():
        TestHelper._checkEnvVars()
        TestHelper._prepareProperties()
        TestHelper._prepareResultsDir()
        TestHelper._prepareTelemetryTests()

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
    def _prepareTelemetryTests():
        print "runAll.py: Preparing telemetry tests"
        subprocess.check_call([TestHelper.GRUNT, 'telemetry'])

    @staticmethod
    def runTests():
        print "runAll.py: Running telemetry tests, results in %s" % TestHelper.RESULTS_DIR

        telemetry_tests = ["loading_benchmark", "smoothness_benchmark"]

        topcoat_test_files = glob.glob(os.getcwd() + "/../perf/page_sets/*.json")

        def genCmd():
            cmd = [
                "python",
                TestHelper.CHROMIUM_SRC + "/tools/perf/run_multipage_benchmarks",
                "--browser=" + TestHelper.BROWSER,
                telemetry_test,
                TestHelper.CHROMIUM_SRC + "tools/perf/page_sets/%s" % topcoat_test_file,
                "-o", TestHelper.RESULTS_DIR + "/%s_%s.txt" % (telemetry_test, topcoat_test_name)
            ]
            if TestHelper.BROWSER_EXEC:
                cmd.insert(3, "--browser-executable=" + TestHelper.BROWSER_EXEC)
            return cmd

        for tf in topcoat_test_files:
            topcoat_test_file = tf.split(os.sep)[-1]
            topcoat_test_name = topcoat_test_file.split(".")[0]
            print "runAll.py: Running tests for %s" % topcoat_test_name

            for telemetry_test in telemetry_tests:
                cmd = genCmd()
                subprocess.call(cmd)

    @staticmethod
    def submitResults():
        print "runAll.py: Pushing telemetry data to the server"
        result_files = glob.glob(TestHelper.RESULTS_DIR + "/*.txt")
        for rf in result_files:
            subprocess.call([
                TestHelper.GRUNT,
                "telemetry-submit",
                "--path=" + rf,
                "--device=" + TestHelper.DEVICE_NAME
            ])


if __name__ == "__main__":
    TestHelper.init()
    TestHelper.runTests()
    TestHelper.submitResults()