var gulp = require('gulp');
var phpcs = require('gulp-phpcs');
var shell = require('gulp-shell');
var phplint = require('phplint').lint;

paths = {
  php: ['**/*.{php,inc,module}', '!node_modules/**', '!vendor/**']
};

/**
 * Codesniffs on correct Drupal standards.
 */
gulp.task('phpcs-drupal', function () {
  return gulp.src(paths.php)
    // Codesniff on correct Drupal standards.
    .pipe(phpcs({
        bin: 'vendor/bin/phpcs',
        standard: 'vendor/drupal/coder/coder_sniffer/Drupal',
        warningSeverity: 0,
        colors: 1
    }))
    // Report all problems to the console.
    .pipe(phpcs.reporter('log'));
});

/**
 * Lints php files.
 */
gulp.task('phplint', function (cb) {
  phplint(paths.php,  { limit: 10 }, function (err, stdout, stderr) {
    if (err) {
        cb(err.message);
    } else {
        cb();
    }
  });
});

/**
 * Cleans up all unwanted dev dependencies after coding.
 */
gulp.task('prod', shell.task([
	// Remove Node dev depedencies
	'npm prune --production',
	// Remove Composer dev dependencies
	'composer update --no-dev'
]));

/**
 * Watch task for code changes.
 */
gulp.task('default', function () {
  gulp.watch(paths.php, ['phplint', 'phpcs-drupal']);
});

// Sets sensible aliases for tasks.
gulp.task('watch',        ['default']);
gulp.task('production',   ['prod']);
gulp.task('clean',        ['prod']);
gulp.task('cleanup',      ['prod']);
gulp.task('build',        ['prod']);
gulp.task('server',     ['prod']);

