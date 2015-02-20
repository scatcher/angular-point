// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var appConfig = require('./gulp.config')();

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        //basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [].concat(
            appConfig.vendorjs,
            appConfig.mockModule,
            appConfig.projectjs,
            appConfig.mocks,
            appConfig.specs
        ),

        // list of files / patterns to exclude
        exclude: [],

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

        preprocessors: {
            'scripts{services, factories, models, directives}/**/*.js': ['coverage']
        },
        //coverageReporter: {
        //    type: "lcov",
        //    dir: "coverage/"
        //},
        //plugins: [
        //    'karma-coverage'
        //],
        //proxies: {
        //    '/dev/': 'dev/'
        //},

        urlRoot: '/base',

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        reporters: ['progress', 'coverage'],

        colors: true

    });
};
