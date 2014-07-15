// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function ( config ) {
    config.set( {
        // base path, that will be used to resolve files and exclude
        basePath:   '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // Third Party
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js',
            'bower_components/SPServices/jquery.SPServices.js',
            'bower_components/chance/chance.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/lodash-deep/lodash-deep.js',
            'bower_components/angular-toastr/dist/angular-toastr.js',

            // Angular Point
            'src/app.js',
            'src/utility/*.js',
            'src/services/*.js',
            'src/factories/*.js',
            'src/models/*.js',
            'src/directives/**/*.js',
            'test/mock/models/*.js',
            'test/spec/factories/*.js',
            'test/spec/services/*.js'
        ],

        // list of files / patterns to exclude
        exclude:    [],

        // web server port
        port:       8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel:   config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch:  true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers:   ['Chrome'],

        proxies: {
            '/dev/': 'dev/'
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun:  false
    } );
};