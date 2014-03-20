module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "build/media/css/main.css": "src/media/css/main.less"
        }
      }
    },

    autoprefixer: {
      development: {
        expand: true,
        flatten: true,
        src: 'build/media/css/*.css',
        dest: 'build/media/css/'
      }
    },

    copy: {
      assets: {
        files: [
          {src: 'src/index.html', dest: 'build/index.html'},
          {expand: true, cwd: 'src/media/img/', src: '*', dest: 'build/media/img/'},
          {expand: true, cwd: 'src/media/js/lib', src: '**/*', dest: 'build/media/js/lib'}
        ]
      }
    },

    watch: {
      styles: {
        files: ['src/media/css/*.less'],
        tasks: ['copy', 'uglify', 'less', 'autoprefixer:development'],
        options: {
          spawn: false
        }
      },

      assets: {
        files: ['src/*', 'media/img/*'],
        tasks: ['copy'],
        options: {
          spawn: false
        }
      },

      scripts: {
        files: ['src/media/js/*.js'],
        tasks: ['jshint', 'uglify']
      },

      libs: {
        files: ['src/media/js/lib/**/*'],
        tasks: ['copy']
      }
    },

    jshint: {
        all: ['src/media/js/*js']
    },

    uglify: {
      options: {
        sourceMap: function (path) {
          return path.replace(/js\/build\/(.*).min.js/, "$1.map.js");
        },
        sourceMappingURL: function (path) {
          return path.replace(/js\/build\/(.*).min.js/, "../../$1.map.js");
        },
        sourceMapRoot: 'build/media/js',
        banner: '/*\n  <%= pkg.name %> v<%= pkg.version %>\n'+
                // '\n  (<%= grunt.template.today("yyyy-mm-dd") === undefined %>)\n'+
                '\n  http://github.com/zombicide\n*/\n'
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: 'media/js/**.js',
          dest: 'build/media/js/',
          flatten: true,
          ext: '.min.js'
        }]
      }
    },

    grunt: {
      files: ['Gruntfile.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['copy', 'less', 'autoprefixer', 'jshint', 'uglify', 'watch']);

};
