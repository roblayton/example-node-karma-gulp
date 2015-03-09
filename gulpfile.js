var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var benchmark = require('gulp-bench');
var bump = require('gulp-bump');
var exec = require('child_process').exec;
var execSync = require('exec-sync');
var tagVersion = require('gulp-tag-version');

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

gulp.task('testff', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['Firefox']
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

//gulp.task('bump', function() {
  //gulp.src('package.json')
    //.pipe(bump({version: execSync('git describe --tags')}))
    //.pipe(gulp.dest('./'));
/*});*/

gulp.task('tag', function() {
  return gulp.src(['./package.json']).pipe(tag_version());
});

gulp.task('default', ['lint', 'test', 'benchmark']);
gulp.task('build', ['lint', 'testff', 'benchmark', 'tag']);
