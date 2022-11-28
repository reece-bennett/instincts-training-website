const { dest, parallel, series, src } = require('gulp');
const del = require('del');
const hb = require('gulp-hb');
const rename = require('gulp-rename');

function clean() {
  return del('build/');
}

function html() {
  return src('src/pages/**/*.hbs')
    .pipe(hb().partials('src/partials/**/*.hbs'))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('build/'));
}

function assets() {
  return src('assets/**/*')
    .pipe(dest('build/'));
}

exports.assets = assets;
exports.clean = clean;
exports.html = html;
exports.build = series(clean, parallel(html, assets));
exports.default = exports.build;
