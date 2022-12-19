const { dest, parallel, series, src, watch } = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const git = require('gulp-git');
const hb = require('gulp-hb');
const moment = require('moment');
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
    .pipe(hb()
      .partials('src/partials/**/*.hbs')
      .helpers('src/helpers/**/*.js'))
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
      baseDir: 'build/',
      serveStaticOptions: {
        extensions: ["html"]
    }
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
  watch(['src/pages/**/*.hbs', 'src/partials/**/*.hbs', 'src/helpers/**/*.js'], series(html, css, bsReload));
  watch('src/css/**/*.css', css);
}

/*
* Github Pages
*/
function cleanRepo() {
  return del("repo");
}

function clone(done) {
  git.clone("git@github.com:reece-bennett/instincts-training-website.git", {args: "-n -b gh-pages repo"}, err => {
    if (err) throw err;
    done();
  });
}

function copyFiles() {
  return src("build/**/*")
    .pipe(dest("repo"));
}

function commit() {
  const dateString = moment().local().format("YYYY-MM-DD hh:mm:ss A");

  return src("repo/*")
    .pipe(git.add({cwd: "repo"}))
    .pipe(git.commit(`Site built ${dateString}`, {cwd: "repo"}));
}

function push(done) {
  git.push("origin", "gh-pages", {cwd: "repo"}, err => {
    if (err) throw err;
    done();
  })
}

/*
* Expose tasks to gulp CLI
*/
exports.assets = assets;
exports.clean = clean;
exports.css = css;
exports.html = html;
exports.build = series(clean, parallel(html, css, assets));
exports.deploy = series(exports.build, cleanRepo, clone, copyFiles, commit, push, cleanRepo);
exports.default = series(exports.build, bsServe, bsWatch);
