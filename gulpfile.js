import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import cleanCSS from 'gulp-clean-css'
import terser from 'gulp-terser'
import svgmin from 'gulp-svgmin'

function html() {
  return gulp.src('index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
}

function css() {
  return gulp.src('src/css/main.css')
    .pipe(cleanCSS({
      inline: ['local']
    }))
    .pipe(gulp.dest('dist/src/css'))
}

function js() {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist/src/js'))
}

function assets() {
  return gulp.src('src/assets/**/*')
    .pipe(svgmin({
      plugins: [
        {
          name: 'removeViewBox',
          active: false
        }
      ]
    }))
    .pipe(gulp.dest('dist/src/assets'))
}

function watchFiles() {
  gulp.watch('index.html', html);
    gulp.watch('src/css/**/*.css', css);
    gulp.watch('src/js/*.js', js);
    gulp.watch('src/assets/**/*', assets);
}

export { html, css, js, assets };

export default gulp.series(
    gulp.parallel(html, css, js, assets),
    watchFiles
);
