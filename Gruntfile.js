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

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['{.tmp,<%= config.src %>, }/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= config.src %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.dist %>/*.{js,html}',
                    '<%= config.src %>/{modules,scripts,views}/{,*/}*.{js,html}',
                    '<%= config.src %>/dev/*.xml'
                ]
            }
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.src %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= config.src %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
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
            server: '.tmp',
            docs: 'docs'
        },

        htmlmin: {
            dist: {
                options: {
                    //collapseWhitespace: true,
                    //collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    //removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: [
                            '*.html',
                            'views/*.html',
                            'modules/**/*.html',
                            'scripts/directives/**/*.html'
                        ],
                        dest: '<%= config.dist %>'
                    }
                ]
            }
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
                    '<%= config.src %>/directives/**/*.js',
                    '.tmp/angular-point-templates.js'
                ],
                dest: '<%= config.dist %>/angular-point.js'
            },
            ieshim: {
                src: [
                    'bower_components/explorer-canvas/excanvas.js',
                    'bower_components/es5-shim/es5-shim.js',
                    'bower_components/json3/lib/json3.js',
                    'bower_components/respond/dest/respond.src.js',
                    'scripts/utility/ap_ie_safe.js'
                ],
                dest: '<%= config.dist %>/ie-shim.js'
            },
            sync: {
                src: [
                    '<%= config.src %>/utility/*.js',
                    '<%= config.dist %>/angular-point-directives.js'
                ],
                dest: '<%= config.dist %>/angular-point-directives.js'
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

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dest: '<%= config.dist %>',
                        src: [
                            //HTML
                            '*.html',
                            'views/{,*/}*.html',
                            'modules/**/*.html',
                            'scripts/**/*.html',

                            //PROJECT SPECIFIC RESOURCES
                            '*.{ico,png,txt}',
                            'images/{,*/}*.{png,jpg,gif}',

                            //FONT AWESOME
                            'bower_components/font-awesome/css/**',
                            'bower_components/font-awesome/fonts/**',

                            //jQuery UI Bootstrap Images
                            'bower_components/jquery-ui-bootstrap/css/custom-theme/images/**',

                            //Glyph Icons
                            'bower_components/bootstrap/fonts/**'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: 'styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }

        },
        uglify: {
            js: {
                src: ['<%= config.dist %>/angular-point.js'],
                dest: '<%= config.dist %>/angular-point.min.js'
            },
            ie: {
                src: '<%= config.dist %>/ie-shim.js',
                dest: '<%= config.dist %>/ie-shim.min.js'

            },
            directives: {
                src: '<%= config.dist %>/angular-point-directives.js',
                dest: '<%= config.dist %>/angular-point-directives.min.js'
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
//                startPage: '/api',
                title: 'SP-Angular Docs'
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
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
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
        'clean:docs',
        'ngdocs'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};