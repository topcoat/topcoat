<pre>
               ___         ___         ___         ___         ___                         
      ___     /  /\       /  /\       /  /\       /  /\       /  /\        ___            
     /  /\   /  /::\     /  /::\     /  /:/      /  /::\     /  /::\      /  /\           
    /  /:/  /  /:/\:\   /  /:/\:\   /  /:/      /  /:/\:\   /  /:/\:\    /  /:/           
   /  /:/  /  /:/  \:\ /  /:/~/:/  /  /:/  ___ /  /:/  \:\ /  /:/~/::\  /  /:/            
  /  /::\ /__/:/ \__\:/__/:/ /:/  /__/:/  /  //__/:/ \__\:/__/:/ /:/\:\/  /::\            
 /__/:/\:\\  \:\ /  /:\  \:\/:/   \  \:\ /  /:\  \:\ /  /:\  \:\/:/__\/__/:/\:\           
 \__\/  \:\\  \:\  /:/ \  \::/     \  \:\  /:/ \  \:\  /:/ \  \::/    \__\/  \:\          
      \  \:\\  \:\/:/   \  \:\      \  \:\/:/   \  \:\/:/   \  \:\         \  \:\         
       \__\/ \  \::/     \  \:\      \  \::/     \  \::/     \  \:\         \__\/         
              \__\/       \__\/       \__\/       \__\/       \__\/                        
</pre>

An experimental CSS library.


### Installing

You can install TopCoat manually by just dropping it in. We recommend downloading a tag so its easy to upgrade.

    <link rel=stylesheet type=text/css href=vendor/topcoat-0.1.0/release/css/topcoat-min.css>

Topcoat also supports popular clientside package management frameworks.

If you are using Bower:

    bower install topcoat

Or Yeoman:

    yeoman install topcoat

There is also support for Component:

    component install topcoat/topcoat

### Running the tests

To run the tests `clone` the repo, `cd` into the test folder and start a localserver (suggestion `python -m SimpleHTTPServer` on osx/linux will start an http server on port 8000) there. Navigate to the specific address and you'll be able to run the tests. 

### Building the src

Topcoat utilizes Grunt for building. You have to install that first

    npm install grunt -g

Then you can run `grunt` to build the sources. The results will be in ./release
There is also a watch task that you can run. It automatically lints and compiles your less sources when it spots any changes.

---

# TopCoat Mobile

An experimental CSS microlibrary for building super fast mobile web apps.

- listview
- titlebar
- tabbar
- code

## Embedded Webview Targets

- iOS 5+
- Android 2.2+
- BlackBerry 6+
- Windows Phone 8+

## Mobile Browser Targets

- Firefox for Android
- Opera Mini
- Android 2.2+ system browser
- Mobile Safari 5+

