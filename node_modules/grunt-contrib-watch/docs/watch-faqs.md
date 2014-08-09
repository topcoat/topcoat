# FAQs

## How do I fix the error `EMFILE: Too many opened files.`?
This is because of your system's max opened file limit. For OSX the default is very low (256). Increase your limit with `ulimit -n 10480`, the number being the new max limit. If you're still running into issues then consider setting the option `forceWatchMethod: 'old'` to use the older and slower stat polling watch method.
