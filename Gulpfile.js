'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('test', ['jshint', 'mocha']);

gulp.task('jshint', function () {
  return gulp.src('*.js').pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('mocha', function () {
  return gulp.src('test.js', { read: false }).pipe(mocha({ reporter: 'spec' }));
});
