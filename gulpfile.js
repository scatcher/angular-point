'use strict';

/* jshint camelcase:false */
var gulp = require('gulp');
//var $ = require('gulp-load-plugins')();
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var fs = require('fs');


var karma = require('karma').server;
var merge = require('merge-stream');
var paths = require('./gulp.config.json');

var env = $.util.env;
var log = $.util.log;
var port = process.env.PORT || 7203;
var pkg = require('./package.json');
var _ = require('lodash');

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function () {
    log('Analyzing source with JSHint, JSCS, and Plato');

    var jshint = analyzejshint([].concat(paths.projectjs, paths.specs));
    var jscs = analyzejscs([].concat(paths.projectjs));

    startPlatoVisualizer();

    return merge(jshint, jscs);
});

gulp.task('build', [
    'templatecache',
    'html',
    'bump'
]);


/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(paths.htmltemplates)
        .pipe($.bytediff.start())
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache('scripts/templates.js', {
            module: pkg.module,
            standalone: false,
            root: ''
        }))
        .pipe($.bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});

gulp.task('html', ['inject-dist'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(paths.index)
        .pipe(assets = $.useref.assets({searchPath: '.'}))

        .pipe(jsFilter)
        .pipe($.ngAnnotate({add: true, single_quotes: true}))
        //.pipe($.stripDebug())
        //.pipe($.bytediff.start())
        //.pipe($.uglify({mangle: true}))
        //.pipe($.bytediff.stop(bytediffFormatter))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        //TODO Create a regexp to replace all font in ui-grid
        .pipe($.bytediff.start())
        .pipe($.csso())
        .pipe($.replace('ui-grid.svg', '../fonts/ui-grid.svg'))
        .pipe($.replace('ui-grid.woff', '../fonts/ui-grid.woff'))
        .pipe($.replace('styles/fonts', 'fonts'))
        //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
        .pipe($.replace('bower_components/bootstrap/fonts', '../fonts'))
        //.pipe($.replace('bower_components/font-awesome/fonts', 'fonts'))
        .pipe($.bytediff.stop(bytediffFormatter))
        .pipe(cssFilter.restore())

        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(paths.build))
        .pipe($.size());
});


gulp.task('clean', function () {
    var del = require('del');
    return del(['.tmp/', 'dist/']);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function (done) {
    startTests(false /*singleRun*/, done);
});


gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');
    var options = {
        //scripts: ['../app.min.js'],
        html5Mode: false,
        //startPage: '/api',
        title: pkg.name,
        titleLink: '/api'
    };
    return gulp.src(paths.projectjs)
        .pipe(gulpDocs.process())
        .pipe(gulp.dest(paths.docs));
});

// Update bower, component, npm at once:
gulp.task('bump', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});


/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    return gulp
        .src(sources)
        .pipe($.jshint(jshintrcFile))
        .pipe($.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
        .src(sources)
        .pipe($.jscs('./.jscsrc'));
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer() {
    log('Running Plato');

    var files = $.glob.sync(paths.projectjs);
    var excludeFiles = /\app\/.*\.spec\.js/;

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = paths.report + 'plato';

    $.plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = $.plato.getOverviewReport(report);
        log(overview.summary);
    }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = ['./app/**/*spaghetti.js'];
    var fork = require('child_process').fork;

    if (env.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork('src/server/app.js', childProcessCompleted);
    } else {
        excludeFiles.push('./test/midway/**/*.spec.js');
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {
            child.kill();
        }
        done();
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
        ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {Number}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

//TODO Make cacheXML logic use gulp.src and process as a stream instead of use the current sync approach
gulp.task('cacheXML', function () {
    createJSON({
        moduleName: pkg.module,
        constantName: 'apCachedXML',
        fileName: 'offlineXML.js',
        dest: 'test/mocks/',
        src: [ 'test/mock/xml/']
    });
});

/**
 * @description
 * Takes folders of cached XHR responses (xml files), escapes the contents, and generates an angular constant object with
 * properties equaling the name of the file and values being the escaped contents of the file.
 * @param {object} options
 * @param {string} [options.constantName='apCachedXML']
 * @param {string} [options.dest=opts.src[0]] The output location for the file.
 * @param {string} [options.fileName='offlineXML.js']
 * @param {string} [options.moduleName='angularPoint']
 * @param {string[]} [options.src] Folders containing XML files to process.
 */
function createJSON(options) {
    var defaults = {
            moduleName: 'angularPoint',
            constantName: 'apCachedXML',
            fileName: 'offlineXML.js',
            //dest: '.',
            src: []
        },
        opts = _.extend({}, defaults, options),
        offlineXML = {operations: {}, lists: {}};

    opts.dest = opts.dest || opts.src[0];

    /** Process each of the src directories */
    opts.src.forEach(function (fileDirectory) {
        /** Go through each XML file in the directory */
        fs.readdirSync(fileDirectory).forEach(function (fileName) {
            if (fileName.indexOf('.xml') > -1) {
                var fileContents = fs.readFileSync(fileDirectory + '/' + fileName, {encoding: 'utf8'});
                var operation = fileContents.split('Response')[0].split('<');
                operation = operation[operation.length - 1];
                if (operation === 'GetListItems' || operation === 'GetListItemChangesSinceToken') {

                    offlineXML.lists[fileName.split('.xml')[0]] = offlineXML.lists[fileName.split('.xml')[0]] || {};
                    offlineXML.lists[fileName.split('.xml')[0]][operation] = fileContents;
                } else {
                    /** Create a property on the offlineXML object with a key equaling the file name (without .xml) and
                     * value being the contents of the file */
                    offlineXML.operations[operation] = offlineXML.operations[operation] || fileContents;
                }
            }
        });
    });

    var fileContents = 'angular.module(\'' + opts.moduleName + '\').constant(\'' + opts.constantName + '\', ';
    /** Stringify object and indent 4 spaces */
    fileContents += JSON.stringify(offlineXML, null, 4) + ');';

    /** Write file to dest */
    return fs.writeFileSync(opts.dest + '/' + opts.fileName, fileContents, {encoding: 'utf8'});
}

/** Used to expose gulp tasks to gulp-devtools
 * Install on system with "npm install -g gulp-devtools"
 * @type {exports}
 */
module.exports = gulp;
