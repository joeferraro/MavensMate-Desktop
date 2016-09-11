var gulp = require('gulp');
var react = require('gulp-react');
var babel = require('gulp-babel');
var open = require('gulp-open');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var path = require('path');
var electron = require('electron-connect').server.create()

gulp.task('copy-electron', function() {
  gulp
    .src(['./src/electron/**/*'])
    .pipe(gulp.dest('./app'));
});

gulp.task('copy-styles', function() {
  gulp
    .src(['./src/app/styles/**/*'])
    .pipe(gulp.dest('./app/styles'));
});

gulp.task('build', ['copy-electron', 'copy-styles'], function() {
  gulp.src('./src/app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ["es2015", "stage-0", "react"]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*', ['build'], (e) => {
    console.log('File ' + e.path + ' was ' + e.type + ', rebuilding...')
  })
});

gulp.task('serve', ['build', 'watch'], () => {
  // electron.start()
  gulp.watch('./app/main.js', electron.restart)
  gulp.watch(['./app/**/*.js'], electron.reload)
})
