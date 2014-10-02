var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var colors = require('colors');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// Unified build task. Bump version and invoke ionic build command for all platforms
gulp.task('build-all-platforms', function() {
  // First, bump app version
  sh.exec('node hooks/after_build/version_bump.js', {async: true, silent: true}, function(code, output) {
    if(code === 0) {
      console.log('>>> '.green, 'App version bumped to ' + output);
      // Then build Android app
      console.log('>>> Running "cordova build --release android"');

      sh.exec('cordova build --release android', {async: true, silent: true}, function(code, output) {
        if(code === 0) {
          console.log('>>> '.green, 'Android build was successful (code: '+ code +')');
          // Finally build ios app
          console.log('>>> Running "ionic build ios"');
          sh.exec('ionic build ios', {async: true, silent: true}, function(code, output) {
            console.log('>>> '.green, 'iOS build was successful (code: '+ code +'), enjoy!');
          });
        }
      });
    } else {
      console.log('An error occurred: ' + output);
    }
  });
});