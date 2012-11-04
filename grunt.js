/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({

    pkg: '<json:package.json>',

    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    less: {
        css: {
            src: ['src/less/topcoat.less'],
            dest: 'release/<%= pkg.version %>/css/topcoat.css',
        }
    },
    
    copy: {
        dist: {
            files: {
                'release/<%= pkg.version %>/font/': 'src/font/**',
                'release/<%= pkg.version %>/img/': 'src/img/**'
            }
        }
    },

   /*
    concat: {
        css: {
            src: [SRC_CSS + 'libs/*.css',
            SRC_CSS + 'app/*.css'],
            dest: BUILD_CSS + 'css/all.css'
        }
    },
    cssmin: {
        css: {
            src: '',
            dest: BUILD_CSS + 'css/all-min.css'
        }
    }
   */
  });

  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-mincss')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.registerTask('default', 'less copy')
}
