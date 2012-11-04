/*global module:false*/

var component = { name: 'topcoat',version: '0.1.0', main: []}
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
  
    grunt.registerTask('manifest', 'Generates component.json file.', function() {
        fs.readdirSync(base).forEach(function(dir){
            if (dir != 'doc') {
                var srcDir = path.join(base, dir)
                fs.readdirSync(srcDir).forEach(function(srcFile) {
                    component.main.push(path.join(dir, srcFile))
                }) 
            } 
        })
        fs.writeFileSync(path.join(__dirname,'component.json'), JSON.stringify(component), 'utf8')
    })

    // fin    
    grunt.registerTask('default', 'less copy mincss manifest')
}
