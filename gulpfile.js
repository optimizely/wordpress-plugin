var gulp        = require('gulp')
    sass        = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('scss/**/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      includePaths : [
        require('lego').includePath
      ]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['sass']);
