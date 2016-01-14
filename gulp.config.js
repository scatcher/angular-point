module.exports = function (projectDir) {
    var app = projectDir + 'src/';
    //var test = projectDir + 'test/';
    //var tmp = projectDir + '.tmp/';
    var libs = './node_modules/';

    var config = {
        /** Optionally Override */
        app: app,
        appTypeScriptReferences: 'typings/ap.d.ts',
        devjs: [
            "./node_modules/jquery/dist/jquery.js",
            "./node_modules/chance/chance.js",
            "./node_modules/angular/angular.js",
            "./node_modules/lodash/lodash.js",
            "./node_modules/angular-mocks/angular-mocks.js",
            "./node_modules/moment/moment.js",
            "./test/mock/app.module.mock.js"
        ],
        offlineXMLSrc: [projectDir + 'xml-cache/'],
        tsFiles: './src/**/*.ts'
    };

    return config;
};
