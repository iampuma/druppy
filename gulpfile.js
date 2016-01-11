var gulp = require('gulp');
var gutil = require('gutil');
var phpcs = require('gulp-phpcs');
var phpcbf = require('gulp-phpcbf');
var phplint = require('phplint').lint;
var shell = require('gulp-shell');

paths = {
  php: ['**/*.{php,inc,module}', '!node_modules/**', '!vendor/**']
};

/**
 * Codesniffs PHP on Drupal standards.
 */
gulp.task('phpcs:drupal', function () {
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
 * Beautifies PHP on Drupal standards.
 */
gulp.task('phpcbf:drupal', function () {
  return gulp.src(paths.php)
    // Beautify on correct Drupal standards.
    .pipe(phpcbf({
      bin: 'vendor/bin/phpcbf',
      standard: 'vendor/drupal/coder/coder_sniffer/Drupal',
      warningSeverity: 0
    }))
    // Report all problems to the console.
    .on('error', gutil.log)
    // Save all php beautified files.
    .pipe(gulp.dest(''));
});

/**
 * Lints PHP files.
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
 * Detects messy PHP code.
 *
 * @link http://phpmd.org/rules/controversial.html @unlink
 * Controversial rules are not checked as it is accepted
 * in Drupal to make use of underscores.
 */
gulp.task('phpmd', shell.task([
  'vendor/bin/phpmd . text cleancode,codesize,design,naming,unusedcode --suffixes php,inc,module --exclude vendor/,node_modules/'
], {ignoreErrors: true}));

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
  gulp.watch(paths.php, ['phplint', 'phpcs:drupal', 'phpmd']);
});

// Set sensible aliases for tasks.
gulp.task('watch',        ['default']);
gulp.task('production',   ['prod']);
gulp.task('build',        ['prod']);
gulp.task('server',       ['prod']);
gulp.task('phpcbf',       ['phpcbf:drupal']);
gulp.task('clean',        ['phpcbf:drupal']);
gulp.task('cleanup',      ['phpcbf:drupal']);
gulp.task('fix',          ['phpcbf:drupal']);
