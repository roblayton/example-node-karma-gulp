var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var benchmark = require('gulp-bench');
var bump = require('gulp-bump');
var exec = require('child_process').exec;
var execSync = require('exec-sync');
var pkg = require('./package.json');
var git = require('gulp-git');

var ERROR_LEVELS = ['error', 'warning'];

function isFatal(level) {
   return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
}

function handleError(level, error) {
   gutil.log(error.message);
   if (isFatal(level)) {
      process.exit(1);
   }
}

function onError(error) { handleError.call(this, 'error', error);}
function onWarning(error) { handleError.call(this, 'warning', error);}

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

gulp.task('validate_version', function() {
  exec('git tag', function(err, stdout) {
    var versions = stdout.split('\n');
    if ((versions.indexOf(pkg.version) > -1) === true) {
      onError();
    }
  });
});

gulp.task('tag', function() {
  var message = 'Release ' + pkg.version;
  execSync('git config user.email ' + pkg.email);
  execSync('git config user.name ' + pkg.author);

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(pkg.version, message))
});

gulp.task('push_tags', function() {
  git.push('origin', 'master', {args:'--tags'}, function(err) {
    if (err) {}
  })
});

gulp.task('default', ['lint', 'test', 'benchmark']);
gulp.task('release', ['validate_version', 'tag', 'push_tags']);
gulp.task('build', ['lint', 'testff', 'benchmark']);
