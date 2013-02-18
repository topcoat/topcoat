Performance tests based on chromium telemetry (see https://github.com/topcoat/topcoat/wiki/Measuring-performance for details)

# Preparing to run the tests
To prepare for running the tests, first change `CHROMIUM_SRC` in `grunt.js` to your chromium src dir, then run:
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
    cd <chromium_src>/tools/perf
    ./run_multipage_benchmarks --browser=system loading_benchmark page_sets/topcoat_buttons.json 
``` 
