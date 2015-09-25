module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');


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
        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },
            app: {
                src: ['www/js/*.js'],
                dest: 'www/build/build.js',
                ignore: 'www/js/build.js'
            }
        }
    });

    grunt.registerTask('build', ['clean', 'browserify']);
    grunt.registerTask('default', ['build', 'watch']);

};