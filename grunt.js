/*global module:false*/

var bower     = { name: 'topcoat', version: '0.1.0', main: []}
,   component = { repo: 'adobe/topcoat', description: 'An experimental CSS library.', styles:['release/css/topcoat-min.css'], files: []} 
,   _         = require('underscore')
,   fs        = require('fs')
,   path      = require('path')
,   base      = path.join(__dirname, 'release')


module.exports = function(grunt) {
    
    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-mincss')
    grunt.loadNpmTasks('grunt-contrib-copy')
    
    grunt.initConfig({

        less: {
            css: {
                src: ['src/less/topcoat.less'],
                dest: 'release/css/topcoat.css',
            }
        },
        
        copy: {
            dist: {
                files: {
                    'release/font/': 'src/font/**',
                    'release/img/': 'src/img/**'
                }
            }
        },

        mincss: {
            css: {
                src: 'release/css/topcoat.css',
                dest: 'release/css/topcoat-min.css'
            }
        }
    })
    
    /* the manifest for component.json is used by Bower */  
    grunt.registerTask('manifest', 'Generates component.json file.', function() {
        fs.readdirSync(base).forEach(function(dir){
            var srcDir = path.join(base, dir)
            fs.readdirSync(srcDir).forEach(function(srcFile) {
                var srcFilePath = path.join('release', dir, srcFile)
                // I do not understand why Bower requires a manifest if it relies on git solely. But whatever.
                bower.main.push(srcFilePath)
                // now adding fonts and images for Component
                if (dir != 'css') component.files.push(srcFilePath)
            }) 
        })
        var c = JSON.stringify(_.extend(bower, component), null, 4)
        fs.writeFileSync(path.join(__dirname,'component.json'), c, 'utf8')
    })

    // fin    
    grunt.registerTask('default', 'less copy mincss manifest')
}
