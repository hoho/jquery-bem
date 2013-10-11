module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            src: {
                src: ['jquery-bem.js'],
                options: {
                    jshintrc: '.jshintrc'
                }
            },
            grunt: {
                src: ['Gruntfile.js'],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                report: 'gzip'
            },
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
            }
        },

        qunit: {
            all: ['test/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('default', ['jshint', 'uglify', 'qunit']);
};
