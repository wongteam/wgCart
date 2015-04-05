/**
 * Created by Ivan Wong <mail@iwong.me> on 05.04.15.
 */


var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var runSequence = require('gulp-run-sequence');

var files = {
	distDir: './dist/',
	src: [
		'./src/wgCart.js',
		'./src/wgCart.derectives.js',
		'./src/wgCart.fulfilment.js'
	],
	dest: {
		dev: 'wgCart.js',
		prod: 'wgCart.min.js'
	}
};

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
	runSequence('concat', ['compress'], cb);
});


gulp.task('concat', function() {
	return gulp.src(files.src)
		.pipe(concat(files.dest.dev))
		.pipe(gulp.dest(files.distDir));
});

gulp.task('compress', function() {
	gulp.src(files.distDir + files.dest.dev)
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(files.distDir));
});

//gulp.task('build-clean', function() {
//	return gulp.src(files.distDir).pipe(clean());
//});