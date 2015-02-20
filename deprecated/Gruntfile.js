'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

//var Dgeni = require('dgeni');

var xmlUtil = require('./../node_modules/angular-point-xml-parser/index.js');

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
            factories: 'src/factories',
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
            docs: 'docs',
            server: '.tmp',
            build: 'build'
        },

        ngtemplates: {
            app: {
                options: {
                    module: 'angularPoint',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true, // Only if you don't use comment directives!
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: '<%= config.src %>/**/*.html',
                dest: '.tmp/angular-point-templates.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= config.src %>/*.js',
                    '<%= config.src %>/constants/*.js',
                    '<%= config.services %>/*.js',
                    '<%= config.factories %>/*.js',
                    '<%= config.src %>/models/*.js',
                    '<%= config.src %>/directives/**/*.js',
                    '!<%= config.src %>/directives/ap_comments/*.js',
                    '.tmp/angular-point-templates.js'
                ],
                dest: '<%= config.dist %>/angular-point.js'
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [
                    {
                        src: '<%= config.dist %>/angular-point.js'
                    }
                ]
            }
        },

        uglify: {
            js: {
                src: ['<%= config.dist %>/angular-point.js'],
                dest: '<%= config.dist %>/angular-point.min.js'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                //'copy:styles'
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
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.js',
                    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular-animate.min.js'
                ],
                html5Mode: false,
                analytics: {
                    account: 'UA-51195298-1',
                    domainName: 'scatcher.github.io'
                },
//                startPage: '/api',
                title: 'Angular-Point API Docs'
            },
            api: {
                src: [
                    '<%= config.src %>/app.js',
                    '<%= config.src %>/constants/*.js',
                    '<%= config.services %>/*.js',
                    '<%= config.factories %>/*.js',
                    '<%= config.src %>/models/*.js',
                    '<%= config.src %>/directives/**/*.js'
                ],
                title: 'API Documentation',
                api: false
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ['**']
        },
        'bump': {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                push: false
            }
        },
        karma: {
            options: {
                browsers: ['Chrome', 'PhantomJS'],
                configFile: 'karma.conf.js'
            },
            unit: {
                autoWatch: false,
                singleRun: true,
                browsers: ['PhantomJS']
            },
            continuous: {
                autoWatch: true,
                singleRun: false,
                browsers: ['PhantomJS']
            },
            coverage: {
                singleRun: true,
                browsers: ['Chrome'],
                preprocessors: {
                    'src/services/*.js': ['coverage'],
                    'src/factories/*.js': ['coverage']
                }
            },
            debug: {
                browsers: ['Chrome'],
                singleRun: false,
                autoWatch: true
            }
        }
        //coveralls: {
        //    options: {
        //        debug: true,
        //        coverage_dir: 'coverage/',
        //        dryRun: true,
        //        force: true,
        //        recursive: true
        //    }
        //}

    });

    //grunt.registerTask('dgeni', 'Generate docs via dgeni.', function () {
    //    var done = this.async();
    //    var dgeni = new Dgeni([require('./dgeni/dgeni-config')]);
    //    dgeni.generate().then(done);
    //});

    grunt.registerTask('parse-xml', function () {
        xmlUtil.createJSON({
            dest: './test/mock/data',
            fileName: 'parsedXML.js',
            constantName: 'apCachedXML',
            src: ['./test/mock/xml']
        });
    });

    grunt.registerTask('dgeni-docs', [
        'clean:build',
        'dgeni'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'parse-xml',
        //'concurrent:test',
        //'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('coverage', [
        'karma:coverage'
    ]);

    grunt.registerTask('debugtest', [
        'karma:debug'
    ]);

    grunt.registerTask('autotest', [
        'karma:continuous'
    ]);

    //grunt.registerTask('autotest:unit', [
    //    'karma:unitAuto'
    //]);

    grunt.registerTask('build', [
        'test',
        'clean:dist',
        'bump',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'uglify',
        'doc'
    ]);
    grunt.registerTask('build-no-test', [
        'clean:dist',
        'ngtemplates',
        'concat',
        'ngAnnotate',
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
