'use strict';

/* jshint camelcase:false */
//var concat = require('concat-stream');
var fs = require('fs');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
//var inject = require('inject');
var projectDir = __dirname + '/';
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var ngdocs = require("gulp-ngdocs");
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var paths = require('./gulp.config')(projectDir);
var pkg = require('./package.json');

require('angular-point-tools')(projectDir, paths);



gulp.task('build', ['gen-ts-refs'], function () {
//    var tsResult = gulp.src(paths.tsFiles)
    var tsResult = gulp.src(['./typings/**/*.d.ts', paths.tsFiles])
        .pipe(sourcemaps.init({loadMaps: true})) // This means sourcemaps will be generated
        .pipe(typescript({
            target: 'ES5',
            sortOutput: true,
            // noExternalResolve: true,
            typescript: require('typescript')
        }));

    return merge([
        tsResult.js
            .pipe(concat(pkg.name + '.js')) // You can use other plugins that also support gulp-sourcemaps
            .pipe(sourcemaps.write('.')) // Now the sourcemaps are added along side the .js file
            // .pipe(sourcemaps.write('.', { sourceRoot: '/' })) // Now the sourcemaps are added along side the .js file
            .pipe(gulp.dest('./dist')),
        tsResult.dts.pipe(gulp.dest('./dist'))
    ]);

});


/**
* Generate docs from code in docs folder.
*/
gulp.task('ngdocs', ['build'], function () {
    
    // return gulp
    //     .src([paths.tsFiles])
    //     .pipe(typedoc({ 
    //         // module: "commonjs", 
    //         gaID: 'UA-51195298-1',
    //         gaSite: 'scatcher.github.io',
    //         out: "./docs/", 
    //         name: "angular-point", 
    //         target: "es5",
    //         includeDeclarations: true
    //     }));

   var options = {
       analytics: {
           account: 'UA-51195298-1',
           domainName: 'scatcher.github.io'
       },
       html5Mode: false,
       title: pkg.name,
       titleLink: '/api'
   };
   return gulp.src('./dist/' + pkg.name + '.js')
       .pipe(ngdocs.process(options))
       .pipe(gulp.dest('./docs'));
});

/**
* Push docs to live site.
*/
gulp.task('ghpages', ['ngdocs'], function () {
   return gulp.src('./docs/**/*')
       .pipe(ghPages());
});


//var args = require('yargs').argv;
//var paths = require('./gulp.paths')();
//var del = require('del');
//var fs = require('fs');
//var gulp = require('gulp');
//var _ = require('lodash');
//var path = require('path');
//var pkg = require('./package.json');
//var $ = require('gulp-load-plugins')({lazy: true});
//var merge = require('merge2');
//
///**
// * List the available gulp tasks
// */
//gulp.task('help', $.taskListing);
//gulp.task('default', ['help']);
//
///**
// * Generates the app.d.ts references file dynamically from all application *.ts files.
// */
//gulp.task('gen-ts-refs', function () {
//    var target = gulp.src(paths.appTypeScriptReferences);
//    var sources = gulp.src([paths.tsFiles], {read: false});
//    return target.pipe($.inject(sources, {
//        starttag: '//{',
//        endtag: '//}',
//        transform: function (filepath) {
//            return '/// <reference path="..' + filepath + '" />';
//        }
//    })).pipe(gulp.dest(paths.typings));
//});
//
//

//
//
//gulp.task('concat', ['clean'], function () {
//    return gulp
//        .src([].concat(paths.js))
//        .pipe($.plumber())
//        .pipe($.concat(pkg.name + '.js'))
//        .pipe($.ngAnnotate({add: true, single_quotes: true}))
//        .pipe(getHeader())
//        .pipe(gulp.dest(paths.build));
//});
//
///**
// * Create concatenated and minified scripts.
// */
//gulp.task('build', ['concat'], function () {
//    return gulp
//        .src(paths.build + pkg.name + '.js')
//        .pipe($.plumber())
//        .pipe($.concat(pkg.name + '.min.js'))
//        .pipe($.uglify())
//        .pipe(getHeader())
//        .pipe(gulp.dest(paths.build));
//});
//
///**
// * Remove all files from the build and temp folders
// * @param  {Function} done - callback when complete
// */
//gulp.task('clean', function (done) {
//    var files = [].concat(
//        paths.temp,
//        paths.build
//    );
//    clean(files, done);
//});
//
//gulp.task('test-prep', function () {
//    var tsResult = gulp.src(paths.testts)
//        .pipe($.typescript({
//            sortOutput: true,
//            declarationFiles: false
//        }));
//
//    return tsResult.js
//        .pipe($.concat('angular-point.js')) // You can use other plugins that also support gulp-sourcemaps
//        .pipe($.sourcemaps.write()) // Now the sourcemaps are added to the .js file
//        .pipe(gulp.dest('.tmp'));
//});
//
//
///**
// * Run specs once and exit
// * To start servers and run midway specs as well:
// *    gulp test --startServers
// * @return {Stream}
// */
//gulp.task('test', ['test-prep'], function (done) {
//    startTests({}, done);
//});
//
///**
// * Run specs and wait.
// * Watch for file changes and re-run tests on each change
// * To start servers and run midway specs as well:
// *    gulp autotest --startServers
// */
//gulp.task('autotest', ['test-prep'], function (done) {
//    startTests({autoWatch: true, singleRun: false}, done);
//});
//
///**
// * Run specs and wait.
// * Watch for file changes and re-run tests on each change
// * To start servers and run midway specs as well:
// *    gulp autotest --startServers
// */
//gulp.task('debugtest', ['test-prep'], function (done) {
//    startTests({
//        autoWatch: true,
//        browsers: ['Chrome'],
//        singleRun: false
//    }, done);
//});
//
//
///**
// * Generate docs from code in docs folder.
// */
//gulp.task('ngdocs', function () {
//    var gulpDocs = require('gulp-ngdocs');
//    var options = {
//        analytics: {
//            account: 'UA-51195298-1',
//            domainName: 'scatcher.github.io'
//        },
//        html5Mode: false,
//        title: pkg.name,
//        titleLink: '/api'
//    };
//    return gulp.src([].concat(paths.distModule, paths.projectjs))
//        .pipe(gulpDocs.process(options))
//        .pipe(gulp.dest(paths.docs));
//});
//
///**
// * Push docs to live site.
// */
//gulp.task('ghpages', ['ngdocs'], function () {
//    gulp.src(paths.docs + '**/*')
//        .pipe($.ghPages());
//});
//
//gulp.task('patch', function () {
//    return incrementVersion('patch');
//});
//gulp.task('feature', function () {
//    return incrementVersion('minor');
//});
//gulp.task('release', function () {
//    return incrementVersion('major');
//});
//
////TODO Make cacheXML logic use gulp.src and process as a stream instead of use the current sync approach
//gulp.task('cacheXML', function (done) {
//    return createJSON({
//        moduleName: pkg.module,
//        constantName: 'apCachedXML',
//        fileName: 'parsedXML.js',
//        dest: 'test/mock/data',
//        src: ['test/mock/xml/']
//    }, done);
//});
//
//
///////////////////////////////////////////////////////////////
//
///**
// * Format and return the header for files
// * @return {String}           Formatted file header
// */
//function getHeader() {
//    var template = ['/**',
//        ' * <%= pkg.name %> - <%= pkg.description %>',
//        ' * @authors <%= pkg.authors %>',
//        ' * @version v<%= pkg.version %>',
//        ' * @link <%= pkg.homepage %>',
//        ' * @license <%= pkg.license %>',
//        ' */',
//        ''
//    ].join('\n');
//    return $.header(template, {
//        pkg: pkg
//    });
//}
//
///**
// * Log a message or series of messages using chalk's blue color.
// * Can pass in a string, object or array.
// */
//function log(msg) {
//    if (typeof(msg) === 'object') {
//        for (var item in msg) {
//            if (msg.hasOwnProperty(item)) {
//                $.util.log($.util.colors.blue(msg[item]));
//            }
//        }
//    } else {
//        $.util.log($.util.colors.blue(msg));
//    }
//}
//
///**
// * Start the tests using karma.
// * @param  {object} options - True means run once and end (CI), or keep running (dev)
// * @param  {boolean} [options.singleRun=true]
// * @param  {boolean} [options.autoWatch=false]
// * @param  {string[]} [options.browsers=['PhantomJS']]
// * @param  {boolean} [options.singleRun=true]
// * @param  {Function} done - Callback to fire when karma is done
// * @return {undefined}
// */
//function startTests(options, done) {
//    var karma = require('karma').server;
//    var defaults = {
//        autoWatch: false,
//        browsers: ['PhantomJS'],
//        pathsFile: __dirname + '/karma.conf.js',
//        singleRun: true
//    };
//    var opts = _.extend(defaults, options);
//
//    karma.start(opts, karmaCompleted);
//
//    ////////////////
//
//    function karmaCompleted(karmaResult) {
//        log('Karma completed');
//
//        if (karmaResult === 1) {
//            done('karma: tests failed with code ' + karmaResult);
//        } else {
//            done();
//        }
//    }
//}
//
///**
// * Delete all files in a given path
// * @param  {Array}   path - array of paths to delete
// * @param  {Function} done - callback when complete
// */
//function clean(path, done) {
//    log('Cleaning: ' + $.util.colors.blue(path));
//    del(path, done);
//}
//
//
///**
// * Bumping version number and tagging the repository with it.
// * Please read http://semver.org/
// *
// * You can use the commands
// *
// *     gulp patch     # makes v0.1.0 → v0.1.1
// *     gulp feature   # makes v0.1.1 → v0.2.0
// *     gulp release   # makes v0.2.1 → v1.0.0
// *
// * To bump the version numbers accordingly after you did a patch,
// * introduced a feature or made a backwards-incompatible release.
// */
//
//function incrementVersion(importance) {
//    // get all the files to bump version in
//    return gulp.src(['./package.json', './bower.json'])
//        // bump the version number in those files
//        .pipe($.bump({type: importance}))
//        // save it back to filesystem
//        .pipe(gulp.dest('./'))
//        // commit the changed version number
//        .pipe($.git.commit('bumps package version'))
//
//        // read only one file to get the version number
//        .pipe($.filter('package.json'))
//        // **tag it in the repository**
//        .pipe($.tagVersion());
//}
//
//
///**
// * @description
// * Takes folders of cached XHR responses (xml files), escapes the contents, and generates an angular constant object
// *     with properties equaling the name of the file and values being the escaped contents of the file.
// * @param {object} options
// * @param {string} [options.constantName='apCachedXML']
// * @param {string} [options.dest=opts.src[0]] The output location for the file.
// * @param {string} [options.fileName='offlineXML.js']
// * @param {string} [options.moduleName='angularPoint']
// * @param {string[]} [options.src] Folders containing XML files to process.
// */
//function createJSON(options, done) {
//    var defaults = {
//            moduleName: 'angularPoint',
//            constantName: 'apCachedXML',
//            fileName: 'offlineXML.js',
//            //dest: '.',
//            src: []
//        },
//        opts = _.extend({}, defaults, options),
//        offlineXML = {operations: {}, lists: {}};
//
//    opts.dest = opts.dest || opts.src[0];
//
//    /** Process each of the src directories */
//    opts.src.forEach(function (fileDirectory) {
//        /** Go through each XML file in the directory */
//        fs.readdirSync(fileDirectory).forEach(function (fileName) {
//            if (fileName.indexOf('.xml') > -1) {
//                var fileContents = fs.readFileSync(fileDirectory + '/' + fileName, {encoding: 'utf8'});
//                var operation = fileContents.split('Response')[0].split('<');
//                operation = operation[operation.length - 1];
//                if (operation === 'GetListItems' || operation === 'GetListItemChangesSinceToken') {
//
//                    offlineXML.lists[fileName.split('.xml')[0]] = offlineXML.lists[fileName.split('.xml')[0]] || {};
//                    offlineXML.lists[fileName.split('.xml')[0]][operation] = fileContents;
//                } else {
//                    /** Create a property on the offlineXML object with a key equaling the file name (without .xml) and
//                     * value being the contents of the file */
//                    offlineXML.operations[operation] = offlineXML.operations[operation] || fileContents;
//                }
//            }
//        });
//    });
//
//    var fileContents = 'angular.module(\'' + opts.moduleName + '\').constant(\'' + opts.constantName + '\', ';
//    /** Stringify object and indent 4 spaces */
//    fileContents += JSON.stringify(offlineXML, null, 4) + ');';
//
//    /** Write file to dest */
//    fs.writeFileSync(opts.dest + '/' + opts.fileName, fileContents, {encoding: 'utf8'});
//
//    return done();
//}
//
///** Used to expose gulp tasks to gulp-devtools
// * Install on system with "npm install -g gulp-devtools"
// * @type {exports}
// */
//module.exports = gulp;
