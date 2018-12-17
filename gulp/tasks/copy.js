const gulp = require('gulp');
const config = require('../config.js');

gulp.task('copy:fonts', () => gulp
    .src(`${config.src.fonts  }/**/*.{ttf,eot,woff,woff2}`)
    .pipe(gulp.dest(config.dest.fonts)));

gulp.task('copy:js', () => gulp
    .src(`${config.src.js  }/**/*.*`)
    .pipe(gulp.dest(config.dest.js)));

gulp.task('copy:lib', () => gulp
    .src(`${config.src.lib  }/**/*.*`)
    .pipe(gulp.dest(config.dest.lib)));

gulp.task('copy:rootfiles', () => gulp
    .src(`${config.src.root  }/*.*`)
    .pipe(gulp.dest(config.dest.root)));

gulp.task('copy:img', () => gulp
    .src([
      `${config.src.img  }/**/*.{jpg,png,jpeg,svg,gif}`,
      `!${  config.src.img  }/svgo/**/*.*`
    ])
    .pipe(gulp.dest(config.dest.img)));

gulp.task('copy', [
  // 'copy:js',
  'copy:img',
  // 'copy:rootfiles',
  // 'copy:lib',
  'copy:fonts'
]);
gulp.task('copy:watch', () => {
  gulp.watch(`${config.src.img }/*`, ['copy']);
});
