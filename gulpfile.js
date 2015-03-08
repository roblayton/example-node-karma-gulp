var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var benchmark = require('gulp-bench');

gulp.task('lint', function() {
  return gulp.src('./src')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('benchmark', function() {
  return gulp.src('bench/utils.js', {read: false})
    .pipe(benchmark());
});

gulp.task('tdd', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
  }, function() {
    done();
  });
});

gulp.task('default', ['lint', 'test', 'benchmark']);
gulp.task('build', ['lint', 'test', 'benchmark']);
