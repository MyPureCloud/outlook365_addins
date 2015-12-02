//    https://dhqbrvplips7x-cloudfront-net-6utcaoovepde.runscope.net/github-outlook365addins/71/
//    https://dhqbrvplips7x.cloudfront.net/github-outlook365addins/71/

'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify');
var replace = require('gulp-replace');
var rimraf = require('gulp-rimraf');
var debug = require('gulp-debug');
require('shelljs/global');
var jasmine = require('gulp-jasmine');
var filenames = require("gulp-filenames");
var fs = require('fs');

var CDN_URL = process.env.CDN_URL || '/';

if(process.env.BUILD_NUMBER){
    CDN_URL = "https://cdn.rawgit.com/MyPureCloud/outlook365addins/"+ process.env.BUILD_NUMBER +"/src/web/";
}

var VERSION = process.env.BUILD_NUMBER || 'Not Built'

console.log("Building application");
console.log("CDN URL: " + CDN_URL);

function createAnalytics(){
    var file = "";

    if(process.env.ANALYTICS != null){
        file = "// jshint ignore: start\n"+"(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){"+
        "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),"+
        "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)"+
        "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');"+

        "ga('create', '"+ process.env.ANALYTICS+"', 'auto');" +
        "ga('send', 'pageview');";
    }

    fs.writeFileSync("src/web/scripts/analytics.js", file);
};

gulp.task('manifest', function () {
   return gulp.src("src/web/*.html")
       .pipe(filenames())
       .on('end', function() {
           var files = filenames.get();
           var currentDate = new Date().toUTCString();
           var manifest = {
                       "indexFiles": [],
                       "name": "github-outlook365addins",
                       "version": VERSION,
                       "buildDate" : currentDate,
                       "buildNumber": VERSION
                   };

            for(var x=0;x<files.length;x++){
                manifest.indexFiles.push({
                    "url": "/github-outlook365addins/" + files[x],
                    "file": "./" + files[x]
                });
            }

            manifest.indexFiles.push({
                "url": "/github-outlook365addins/purecloud.jpg",
                "file": "./images/purecloud.jpg"
            });

            manifest.indexFiles.push({
                "url": "/github-outlook365addins/analytics.js",
                "file": "./scripts/analytics.js"
            });

            manifest.indexFiles.push({
                "url": "/github-outlook365addins/cdn.js",
                "file": "./scripts/cdn.js"
            });

            fs.writeFileSync("localBuild/manifest.json", JSON.stringify(manifest, null, " "));

    })
;
});


gulp.task('test', function () {
    return gulp.src('./spec/**')
        .pipe(jasmine());
});

gulp.task('bower', function() {
    return gulp.src('src/web/bower_components/**/*.*')
        .pipe(gulp.dest('localBuild/bower_components/'))
});

gulp.task('lambda', function() {
    gulp.src('lambda.zip', { read: false })
        .pipe(rimraf());

    exec('zip dist/lambda.zip node_modules/request/*', {silent:true});
    exec('zip -j dist/lambda.zip src/lambda/lambda.js', {silent:true});

    return;
});

gulp.task('scripts', function() {
    createAnalytics();
    
    return gulp.src('src/web/scripts/**/*.js')
        //.pipe(jshint({ es5: false }))
        //.pipe(jshint.reporter('default'))
        .pipe(gulp.dest('localBuild/scripts'));
});

gulp.task('images', function() {
  return gulp.src('src/web/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('localBuild/images'));
});

gulp.task('css', function() {
  return gulp.src('src/web/styles/**/*')
    .pipe(gulp.dest('localBuild/styles'));
});

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
      .pipe(rimraf());
});

gulp.task('html', function() {

  return gulp.src('src/web/**/*.html')
      .pipe(replace(/(src|href){1}=(['"])\/(?!cdn|analytics)/g, '$1=$2' + CDN_URL))
    .pipe(gulp.dest('localBuild'));
});

gulp.task('watch', function() {
    gulp.watch('./src/web/**/*.*', ['default']);
});

gulp.task('default', ['clean', 'bower', 'scripts','images', 'css','html', 'manifest']);
