const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config');

gulp.task('js', function() { gulp.src(`${config.src.js}/**/*.*`).pipe(sourcemaps.init()).pipe(sourcemaps.write('./')).pipe(gulp.dest(config.dest.js))})

gulp.task('js:watch', function() {
  gulp.watch(config.src.js + '/**/*.*', ['js']);
});