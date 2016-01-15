module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dest: 'www/build/'
    },
    watch: {
      scripts: {
        files: ['www/js/**/*.js', 'www/jsx/**/*.js'],
        tasks: ['build'],
        options: {
          spawn: false
        }
      }
    },
    connect: {
      server: {
        options: {
          base: './www/'
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'www/css/main.min.css': ['www/css/main.css']
        }
      }
    },
    browserify: {
      options: {
        transform: [require('grunt-react').browserify]
      },
      app: {
        src: ['www/js/*.js'],
        dest: 'www/build/build.js',
        ignore: 'www/js/build.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        src: 'www/build/build.js',
        dest: 'www/build/build.min.js'
      }
    },
  });

  grunt.registerTask('build', ['clean', 'browserify', 'uglify', 'cssmin']);
  grunt.registerTask('default', ['build', 'watch']);

};
