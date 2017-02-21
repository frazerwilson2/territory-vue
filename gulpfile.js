'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task("compilejs", function () {
  return gulp.src("./build/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
 
gulp.task('watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./build/**/*.js', ['compilejs']);
});

gulp.task("default", function () {
  return gulp.src("./build/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});