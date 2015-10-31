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

gulp.task('test', function () {
    return gulp.src('./spec/**')
        .pipe(jasmine());
});

gulp.task('bower', function() {
    return gulp.src('src/bower_components/**/*.*')
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
/*
    require('fs').writeFileSync('localBuild/scripts/config.js', JSON.stringify(
        {
            build: '1234'
        }
    ));
*/

  return gulp.src('src/scripts/**/*.js')
    //.pipe(jshint('.jshintrc'))
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
      .pipe(replace(/foo/g, 'bar'))
    .pipe(gulp.dest('localBuild'));
});

gulp.task('watch', function() {
    gulp.watch('./src/web/*.*', ['default']);
});

gulp.task('default', ['clean', 'bower', 'scripts','images', 'css','html']);
