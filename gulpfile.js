var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var _ = require('lodash');
var path = require('path');
var pkg = require('./package.json');
var $ = require('gulp-load-plugins')({lazy: true});


/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.projectjs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

gulp.task('concat', ['clean'], function () {
    return gulp
        .src([].concat(config.distModule, config.projectjs))
        .pipe($.plumber())
        .pipe($.concat(pkg.name + '.js'))
        .pipe($.ngAnnotate({add: true, single_quotes: true}))
        .pipe(getHeader())
        .pipe(gulp.dest(config.build));
});

/**
 * Create concatenated and minified scripts.
 */
gulp.task('build', ['concat'], function() {
    return gulp
        .src(config.build + pkg.name + '.js')
        .pipe($.plumber())
        .pipe($.concat(pkg.name + '.min.js'))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var files = [].concat(
        config.temp,
        config.build
    );
    clean(files, done);
});


/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function(done) {
    startTests({} , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
    startTests({autoWatch: true, singleRun: false}, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('debugtest', function(done) {
    startTests({
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    } , done);
});


////////////////


/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Generate docs from code in docs folder.
 */
gulp.task('ngdocs', function () {
    var gulpDocs = require('gulp-ngdocs');
    var options = {
        html5Mode: false,
        title: pkg.name,
        titleLink: '/api'
    };
    return gulp.src([].concat(config.distModule, config.projectjs))
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest(config.docs));
});

/**
 * Update bower, component, npm at once:
 */
gulp.task('bump', function () {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});

/**
 * Push docs to live site.
 */
gulp.task('ghpages', ['ngdocs'], function() {
    gulp.src(config.docs + '**/*')
        .pipe($.ghPages());
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(options, done) {
    var karma = require('karma').server;
    var defaults = {
        autoWatch: false,
        browsers: ['PhantomJS'],
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    };
    var opts = _.extend(defaults, options);

    karma.start(opts, karmaCompleted);

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');

        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}


/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function incrementVersion(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe($.bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe($.git.commit('bumps package version'))

        // read only one file to get the version number
        .pipe($.filter('package.json'))
        // **tag it in the repository**
        .pipe($.tagVersion());
}

gulp.task('patch', function() { return incrementVersion('patch'); });
gulp.task('feature', function() { return incrementVersion('minor'); });
gulp.task('release', function() { return incrementVersion('major'); });

//TODO Make cacheXML logic use gulp.src and process as a stream instead of use the current sync approach
gulp.task('cacheXML', function (done) {
    return createJSON({
        moduleName: pkg.module,
        constantName: 'apCachedXML',
        fileName: 'parsedXML.js',
        dest: 'test/mock/data',
        src: [ 'test/mock/xml/']
    }, done);
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
function createJSON(options, done) {
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
    fs.writeFileSync(opts.dest + '/' + opts.fileName, fileContents, {encoding: 'utf8'});

    return done();
}

/** Used to expose gulp tasks to gulp-devtools
 * Install on system with "npm install -g gulp-devtools"
 * @type {exports}
 */
module.exports = gulp;
