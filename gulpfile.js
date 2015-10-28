'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify');
var replace = require('gulp-replace');
var rimraf = require('gulp-rimraf');

gulp.task('bower', function() {
    return gulp.src('bower_components/**/*.*')
        .pipe(gulp.dest('localBuild/bower_components/'))
});

gulp.task('scripts', function() {
/*
    require('fs').writeFileSync('localBuild/scripts/config.js', JSON.stringify(
        {
            build: '1234'
        }
    ));
*/

  return gulp.src('public/scripts/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(gulp.dest('localBuild/scripts'));
});

gulp.task('images', function() {
  return gulp.src('public/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('localBuild/images'));
});

gulp.task('css', function() {
  return gulp.src('public/styles/**/*')
    .pipe(gulp.dest('localBuild/styles'));
});

gulp.task('clean', function() {
  return gulp.src('./dist', { read: false })
      .pipe(rimraf());
});

gulp.task('html', function() {

  return gulp.src('public/**/*.html')
      .pipe(replace(/foo/g, 'bar'))
    .pipe(gulp.dest('localBuild'));
});

gulp.task('watch', function() {
    gulp.watch('./public/*.*', ['default']);
});

gulp.task('default', ['clean', 'bower', 'scripts','images', 'css','html']);
