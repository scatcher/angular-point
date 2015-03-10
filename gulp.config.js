module.exports = function () {
    var temp = './.tmp/';
    var src = './src/';
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };

    var config = {
        projectjs: [
            src + "**/*.js",
            "!" + src + "app.module.js"
        ],
        // app js, with no specs
        js: [
            src + '**/*.module.js',
            src + '**/*.js',
            '!' + src + '**/*.spec.js'
        ],
        specs: [
            "./test/spec/**/*.spec.js"
        ],
        build: "./dist/",
        docs: "./docs/",
        offlinexml: [
            "./xml-cache/**/*.xml"
        ],
        devjs: [
            "./bower_components/chance/chance.js",
            "./test/mocks/**/*.js",
            "./bower_components/angular-mocks/angular-mocks.js",
            "./bower_components/angular-point/test/mock/apMockBackend.js"
        ],
        temp: temp,
        mocks: [
            "./test/mock/**/*.js",
            "!./test/mock/**/app.module.js"
        ],
        mockModule: './test/mock/app.module.js',
        distModule: './src/app.module.js',

        vendorjs: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/chance/chance.js',
            'bower_components/lodash/lodash.js',
            'bower_components/lodash-deep/lodash-deep.js',
            'bower_components/angular-toastr/dist/angular-toastr.js'
        ],
        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false
            }
        }
    };

    return config;
};
