module.exports = function (projectDir) {
    var app = projectDir + 'src/';
    var test = projectDir + 'test/';
    var tmp = projectDir + '.tmp/';
    var bower = './bower_components/';

    var config = {
        /** Optionally Override */
        app: app,
        appTypeScriptReferences: 'typings/ap.d.ts',
        devjs: [
            bower + "chance/chance.js",
            bower + "angular-mocks/angular-mocks.js",
            "./test/mock/app.module.mock.js",
            "./test/mock/**/*.js"
        ],
        tsFiles: './src/**/*.ts'
    };

    return config;
};
