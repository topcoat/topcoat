# Settings

There are a number of options available. Please review the [minimatch options here](https://github.com/isaacs/minimatch#options). As well as some additional options as follows:

## files
Type: `String|Array`

This defines what file patterns this task will watch. Can be a string or an array of files and/or minimatch patterns.

## tasks
Type: `String|Array`

This defines which tasks to run when a watched file event occurs.

## options.interrupt
Type: `boolean`
Default: false

As files are modified this watch task will spawn tasks in child processes. The default behavior will only spawn a new child process per target when the previous process has finished. Set the `interrupt` option to true to terminate the previous process and spawn a new one upon later changes.

Example:
```js
watch: {
  scripts: {
    files: '**/*.js',
    tasks: ['jshint'],
    options: {
      interrupt: true
    }
  }
}
```

## options.debounceDelay
Type: `Integer`
Default: 500

How long to wait before emitting events in succession for the same filepath and status. For example if your `Gruntfile.js` file was `changed`, a `changed` event will only fire again after the given milliseconds.

Example:
```js
watch: {
  scripts: {
    files: '**/*.js',
    tasks: ['jshint'],
    options: {
      debounceDelay: 250
    }
  }
}
```

## options.interval
Type: `Integer`
Default: 100

The `interval` is passed to `fs.watchFile`. Since `interval` is only used by `fs.watchFile` and this watcher also uses `fs.watch`; it is recommended to ignore this option. *Default is 100ms*.

## options.forceWatchMethod
Type: `false|'new'|'old'`
Default: false

Node.js has two file watching methods: 'old' (`fs.watchFile`) which uses stat polling and 'new' (`fs.watch`) which attempts to use the system's built-in watch mechanism. By default, this watch task uses both methods and which ever method responds first will be used for subsequent events.

There may be some setups where you would need to force a specific watch method, such as on networked file system. Set `options.forceWatchMethod: 'old'` to specifically use the old watch method, `fs.watchFile`.
