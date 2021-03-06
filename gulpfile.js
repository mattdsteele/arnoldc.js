'use strict';

var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('clean', function () {
  return Promise.all([
    del(['test/output']),
    del(['lib'])
  ]);
});


gulp.task('jison', function () {
  return gulp.src('src/**/*.jison')
    .pipe(gulp.dest('lib'));
});

gulp.task('compile', gulp.series('jison', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
}));

gulp.task('test', gulp.series(['clean', 'compile', function () {
  return gulp.src('test/**/*Test.js', { read: false })
    .pipe(mocha());
}]));

gulp.task('lint', gulp.series(['compile', function () {
  return gulp.src(['bin/**.js', 'lib/**.js', 'test/**.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}]));


gulp.task('default', gulp.series('clean', 'jison', 'compile', 'lint', 'test'));
