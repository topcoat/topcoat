# grunt-shell

[Grunt][grunt] task to run shell commands.

E.g. compile Compass (`compass compile`) or get the current git branch (`git branch`).


## Getting started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-shell`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-shell');
```


## Documentation


### Example usage

This grunt task is a [multi task](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md#multi-tasks-%E2%9A%91), which means you can specify multiple subtasks and grunt will iterate over them. The `dist` below is a subtask, you could e.g. create a `dev` subtask to handle stuff while developing. You can also add a special subtask named `_options` that can contain options for all your subtasks.


#### Run command

Create a folder named `test`.

```javascript
shell: {
	make_directory: {
		command: 'mkdir test'
	}
}
```

Command expand templates :

```javascript
test_dir: 'test',
shell: {
	make_directory: {
		command: 'mkdir <% test_dir %>'
	}
}
```



#### Run command and display output

Output a directory listing to your Terminal.

```javascript
shell: {
	directory_listing: {
		command: 'ls',
		stdout: true
	}
}
```


#### Run command and handle output

Do whatever you want with the stdout.

```javascript
function log() {
	console.log( this );
}

...

shell: {
	directory_listing: {
		command: 'ls',
		stdout: log
	}
}
```

#### Option passed to the .exec() method

Run a command in another directory. In this example we run it in a subfolder using the `cwd` option.

```javascript
shell: {
	subfolder_ls: {
		command: 'ls',
		stdout: true,
		execOptions: {
			cwd: './tasks'
		}
	}
}
```


#### Custom callback

Define custom callback method to handle everything yourself. Check out [shell.js](https://github.com/sindresorhus/grunt-shell/blob/master/tasks/shell.js) to see how it's handled by default.

```javascript
function customHandler() {
	console.log( this, this.data.stdout );
}

...

shell: {
	ls: {
		command: 'ls',
		callback: customHandler
	}
}
```


#### Multiple subtasks

This task is a [multi task](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md#multi-tasks-%E2%9A%91), which means you can specify multiple subtasks and grunt will iterate over them.

```javascript
shell: {
	directory_listing: {
		command: 'ls',
		stdout: true
	},
	compile_coffescript: {
		command: 'coffee main.coffee',
		failOnError: true
	}
}
```

#### Global options

You can define global options in a subtask called `_options`. Your subtasks will then inherit those options with the ability to override them.


```javascript
shell: {
	directory_listing: {
		command: 'ls',
		stdout: true
	},
	create_folder: {
		command: 'mkdir test',
		failOnError: false
	},
	_options: {
		failOnError: true
	}
}
```


### Options


#### command

**Required**  
Accepts: String

Your command is my wish.


#### stdout

Default: `false`  
Accepts: Boolean / Function

Show stdout in the Terminal. You can supply a function to handle the output.


#### stderr

Default: `false`  
Accepts: Boolean / Function

Show stderr in the Terminal. You can supply a function to handle the output.


#### failOnError

Default: `false`  
Accepts: Boolean

Fail task if it encounters an error.


#### execOptions

Default: `undefined`  
Accepts: Object

Specify some options to be passed to the [.exec()](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) method:

- `cwd` String *Current working directory of the child process*
- `env` Object *Environment key-value pairs*
- `setsid` Boolean
- `encoding` String *(Default: 'utf8')*
- `timeout` Number *(Default: 0)*
- `maxBuffer` Number *(Default: 200\*1024)*
- `killSignal` String *(Default: 'SIGTERM')*


#### callback

Default: `undefined`  
Accepts: Function

Lets you override the default callback with your own. Everything you need is available on `this`.


## Tests

Grunt currently doesn't have a way to test tasks directly. You can test this task by running `grunt` and manually verify that it works.


## Contribute

In lieu of a formal styleguide, take care to maintain the existing coding style.


## License

MIT License
(c) [Sindre Sorhus](http://sindresorhus.com)


[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md