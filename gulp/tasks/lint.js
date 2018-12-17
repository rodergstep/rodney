const gulp = require('gulp');
const config = require('../config');
const htmlhint = require('gulp-htmlhint');
const sassLint = require('gulp-sass-lint');

const git = require('gulp-git');

gulp.task('lint:js', () => {
  // return gulp.src(['src/js/**/*.js', '!node_modules/**'])
  //   .pipe(eslint())
  //   .pipe(eslint.format())
  //   .pipe(eslint.failAfterError());
});

gulp.task(
  'lint:html',
  () =>
    gulp
      .src(`${config.dest.html}/*.html`)
      .pipe(htmlhint('.htmlhintrc'))
      .pipe(htmlhint.failReporter()),
);

gulp.task(
  'lint:sass',
  () =>
    gulp
      .src('src/sass/**/*.s+(a|c)ss')
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError()),
);

gulp.task('lint', ['lint:sass', 'lint:html']);
