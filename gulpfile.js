var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var benchmark = require('gulp-bench');
var bump = require('gulp-bump');
var exec = require('child_process').exec;
var execSync = require('exec-sync');
var pkg = require('./package.json');
var git = require('gulp-git');

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

gulp.task('release', function(done) {
  exec('git tag', function(err, stdout) {
    var versions = stdout.split('\n');
    var message = 'Release ' + pkg.version;

    if ((versions.indexOf(pkg.version) > -1) === true) {
      done(new Error('Version already exists'));
    } else {
      git.exec({args: 'config user.email ' + pkg.email}, function(err, stdout) {
        if (err) throw err;

        git.exec({args: 'config user.name ' + pkg.author}, function(err, stdout) {
          if (err) throw err;
            git.exec('commit', message, function(err, stdout) {
              if (err) throw err;
                git.exec('tag', pkg.version, message, function(err, stdout) {
                  if (err) throw err;
                    git.exec('push', 'origin', 'master', function(err, stdout) {
                      if (err) throw err;
                    });
                });
            });
        });
      });
    }
  });
});

gulp.task('default', ['lint', 'test', 'benchmark']);
gulp.task('test', ['lint', 'test', 'benchmark']);
gulp.task('build', ['lint', 'testff', 'benchmark']);
