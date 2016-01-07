var gulp = require('gulp');
var phpcs = require('gulp-phpcs');
var shell = require('gulp-shell');

/**
 * Codesniffs on correct Drupal standards.
 */
gulp.task('default', function () {
    return gulp.src(['./**/*.php', './**/*.inc', './**/*.module', '!node_modules/', '!vendor/**/*'])
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
 * Cleanup all unnecessary dev dependencies again after coding.
 */
gulp.task('prod', shell.task([
	// Remove Node dev depedencies
	'npm prune --production',
	// Remove Composer dev dependencies
	'composer update --no-dev'
]));

gulp.task('production', ['prod']);
gulp.task('clean', ['prod']);
gulp.task('cleanup', ['prod']);
gulp.task('build', ['prod']);
gulp.task('server', ['prod']);