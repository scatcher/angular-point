// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        //basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // Third Party
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/chance/chance.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/lodash-deep/lodash-deep.js',
            'bower_components/angular-toastr/dist/angular-toastr.js',

            // Angular Point
            'test/mock/app.mock.js',
            'test/mock/run.mock.js',
            'test/mock/data/parsedXML.js',
            'src/constants.js',
            'src/config.js',
            'src/services/*.js',
            'src/factories/*.js',
            'src/models/*.js',
            'src/directives/**/*.js',
            'test/mock/**/*.js',
            'test/spec/factories/*.js',
            'test/spec/services/*.js'


        ],

        // list of files / patterns to exclude
        exclude: ['test/mock/xmlConverter.js'],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        //browsers: ['Chrome'],
        browsers: ['PhantomJS'],

        //preprocessors: {
            //'src/services/*.js': ['coverage'],
            //'src/factories/*.js': ['coverage']
            //'src/models/*.js': ['coverage'],
            //'src/directives/**/*.js': ['coverage']
        //},

        proxies: {
            '/dev/': 'dev/'
        },

        urlRoot: '/base',

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        reporters: ['progress', 'coverage'],

        colors: true

    });
};