module.exports = function (projectDir) {
    var app = projectDir + 'src/';
    var bower = './bower_components/';

    var config = {
        /** Optionally Override */
        app: app,
        appTypeScriptReferences: 'typings/ap.d.ts',
        devjs: [
            bower + "chance/chance.js",
            bower + "angular-mocks/angular-mocks.js",
            bower + "moment/moment.js",
            "./test/mock/app.module.mock.js"
        ],
        offlineXMLSrc: [projectDir + 'xml-cache/'],
        tsFiles: './src/**/*.ts'
    };

    return config;
};
