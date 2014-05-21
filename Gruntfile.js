'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: {
            // configurable paths
            src: 'src',
            dist: 'dist',
            services: 'src/services'
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>/*',
                            '<%= config.dist %>/**/*',
                            '!<%= config.dist %>/.git*'
                        ]
                    }
                ]
            },
            docs: 'docs'
        },

        ngtemplates: {
            app: {
                options: {
                    module: 'angularPoint'
                },
                src: '<%= config.src %>/**/*.html',
                dest:'.tmp/angular-point-templates.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= config.src %>/app.js',
                    '<%= config.services %>/*.js',
                    '<%= config.src %>/models/user_model.js',
                    '<%= config.src %>/directives/**/*.js',
                    '!<%= config.src %>/directives/ap_comments/*.js',
                    '.tmp/angular-point-templates.js'
                ],
                dest: '<%= config.dist %>/angular-point.js'
            },
            iesafe: {
                src: [
                    'bower_components/explorer-canvas/excanvas.js',
                    'bower_components/es5-shim/es5-shim.js',
                    'bower_components/json3/lib/json3.js',
                    'bower_components/respond/dest/respond.src.js',
                    'src/utility/ap_ie_safe.js'
                ],
                dest: '<%= config.dist %>/ie-safe.js'
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        src: '<%= config.dist %>/angular-point.js',
                        dest: '<%= config.dist %>/angular-point.js'
                    }
                ]
            }
        },

        uglify: {
            js: {
                src: ['<%= config.dist %>/angular-point.js'],
                dest: '<%= config.dist %>/angular-point.min.js'
            },
            ie: {
                src: '<%= config.dist %>/ie-safe.js',
                dest: '<%= config.dist %>/ie-safe.min.js'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'svgmin'
            ]
        },

        ngdocs: {
            options: {
                dest: 'docs',
                scripts: [
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js',
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-animate.min.js'
                ],
                html5Mode: false,
                analytics: {
                    account: 'UA-51195298-1',
                    domainName: 'scatcher.github.io'
                },
//                startPage: '/api',
                title: 'Angular-Point API Docs'
            },
            api: [
                '<%= config.services %>/modal_srvc.js',
                '<%= config.services %>/model_srvc.js',
                '<%= config.services %>/data_srvc.js',
                '<%= config.services %>/queue_srvc.js',
                '<%= config.services %>/utility_srvc.js'
            ]
//            model: {
//                src: ['<%= config.services %>/model_srvc.js'],
//                title: 'Model Service'
//            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ['**']
        }
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'ngtemplates',
        'concat',
        'ngmin',
        'uglify',
        'doc'
    ]);

    grunt.registerTask('doc', [
//        'clean:docs',
        'ngdocs'
    ]);

    grunt.registerTask('build-docs', [
        'doc',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};