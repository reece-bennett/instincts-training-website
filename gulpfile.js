const { dest, parallel, series, src, watch } = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const hb = require('gulp-hb');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

/*
* Build steps
*/
function clean() {
  return del('build/');
}

function html() {
  return src('src/pages/**/*.hbs')
    .pipe(hb().partials('src/partials/**/*.hbs'))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('build/'));
}

function css() {
  return src('src/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/'));
}

function assets() {
  return src('src/assets/**/*')
    .pipe(dest('build/'));
}

/*
* Browser-Sync
*/
const server = browserSync.create();

function bsServe(done) {
  server.init({
    server: {
      baseDir: 'build/'
    },
    open: false
  });
  done();
}

function bsReload(done) {
  server.reload();
  done();
}

function bsWatch() {
  watch('src/assets/**/*', series(assets, bsReload));
  watch(['src/pages/**/*.hbs', 'src/partials/**/*.hbs'], series(html, css, bsReload));
  watch('src/css/**/*.css', css);
}

/*
* Expose tasks to gulp CLI
*/
exports.assets = assets;
exports.clean = clean;
exports.css = css;
exports.html = html;
exports.build = series(clean, parallel(html, css, assets));
exports.default = series(exports.build, bsServe, bsWatch);
