// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function ( config ) {
    config.set( {
        // base path, that will be used to resolve files and exclude
        basePath:   '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files:      [
            'demo/bower_components/jquery/dist/jquery.js',
            'demo/bower_components/angular/angular.js',
            'demo/bower_components/angular-mocks/angular-mocks.js',
            'demo/bower_components/angular-animate/angular-animate.js',
            'demo/bower_components/angular-resource/angular-resource.js',
            'demo/bower_components/angular-sanitize/angular-sanitize.js',
            'demo/bower_components/angular-route/angular-route.js',
            'demo/bower_components/angular-ui-router/release/angular-ui-router.js',

            'demo/bower_components/SPServices/jquery.SPServices-2014.01.js',
            'demo/bower_components/lodash/dist/lodash.js',
            'demo/bower_components/lodash-deep/lodash-deep.js',
            'demo/bower_components/toastr/toastr.js',
            'demo/bower_components/select2/select2.js',
            'demo/bower_components/ng-ckeditor/libs/ckeditor/ckeditor.js',
            'demo/bower_components/ng-table/ng-table.js',
            'demo/bower_components/angular-bootstrap/ui-bootstrap.js',
            'demo/bower_components/angular-ui-calendar/src/calendar.js',
            'demo/bower_components/angular-ui-date/src/date.js',
            'demo/bower_components/angular-ui-sortable/src/sortable.js',
            'demo/bower_components/angular-ui-select2/src/select2.js',
            'demo/bower_components/angular-ui-utils/ui-utils.js',
            'demo/bower_components/ng-ckeditor/ng-ckeditor.src.js',
            'demo/bower_components/angular-google-chart/ng-google-chart.js',
            'demo/bower_components/firebase/firebase.js',
            'demo/bower_components/angularfire/angularfire.js',
            'demo/bower_components/angular-spinner/angular-spinner.js',
            'demo/bower_components/angular-toastr/dist/angular-toastr.js',

            'src/scripts/*.js',
            'src/scripts/**/*.js',
            'src/modules/**/*.js',
            'test/mock/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
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