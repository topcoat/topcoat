Performance tests based on chromium telemetry (see https://github.com/topcoat/topcoat/wiki/Measuring-performance for details)

# Preparing to run the tests
A few steps are required before you can run the telemetry tests. 

First of all, you need to download chromium source code locally, as describen on http://www.chromium.org/developers/how-tos/get-the-code. No need to compile, just download it. 
Then export the location for the 'src' folder in the CHROMIUM_SRC environment variable, like in
```
export CHROMIUM_SRC = /Users/cataling/work/chromium/home/src_tarball/tarball/chromium/src/
```

Then you need to manually patch a little bit two of the benchmark files (the patches are just one liners, it they get bigger we'll just duplicate the benchmarks in topcoat). Locate the files named `loading_benchmark.py` and `smoothness_benchmark.py` in `$CHROMIUM_SRC/tools/perf/perf_tools`. Inside, look for the method `MeasurePage`, and find an appropriate place to paste `results.Add("UserAgent", "", tab.EvaluateJavaScript("navigator.userAgent"));`. This makes the benchmarks include the user agent string as part of their output, and we need this info to submit the results to the server. 

NOTE: we should make a patch for these modifications

Next you can prepare the telemetry tests:
```
grunt telemetry
```
This does two things: generates test files based on grunt templates from `page_sets_src`, and copies them to the right location in chromium telemetry tests. To clean up the generated files, run
```
grunt clean:telemetry
```

You should do a clean before committing to git, so that you don't accidentally commit the generated files.

# Running the tests
After generating the test files and copying them to chromium, you can run the telemetry tests. The tests currently require the `topcoat` folder to be available through http under port 8000, so you first need to:
```
cd <topcoat_base_dir>
python -m SimpleHTTPServer
```

Then you can start the tests:
```
cd $CHROMIUM_SRC/tools/perf
./run_multipage_benchmarks --browser=system loading_benchmark page_sets/topcoat_buttons.json -o /tmp/loading_benchmark_topcoat_buttons.txt
./run_multipage_benchmarks --browser=system smoothness_benchmark page_sets/topcoat_buttons.json -o /tmp/loading_benchmark_topcoat_buttons.txt
``` 
We store the benchmark output in a file - the next script will take this output and push it to the server

# Pushing benchmark results to the server

TBD - working on it
