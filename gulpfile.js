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


