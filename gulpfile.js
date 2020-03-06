const { src, dest, parallel, series, watch } = require('gulp');
const gulpHtmlmin = require('gulp-htmlmin');
const gulpSass = require('gulp-sass');
const gulpBabel = require('gulp-babel');
const gulpJs = require('gulp-uglify');
const gulpImagemin = require('gulp-imagemin');
const gulpConnect = require('gulp-connect');

function createServer(cb) {
    gulpConnect.server({
        root: './dist',
        livereload: true
    });
    cb();
}

function handleHtml() {
    return src('./src/*.html')
        .pipe(gulpHtmlmin({
            removeTagWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeEmptyElements: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true
        }))
        .pipe(dest('./dist'))
        .pipe(gulpConnect.reload());
}

function handleSass() {
    return src('./src/static/sass/*.scss')
        .pipe(gulpSass({
            outputStyle: "compressed"
        }))
        .pipe(dest('./dist/static/css'))
        .pipe(gulpConnect.reload());
}

function handleJs() {
    return src('./src/static/js/*.js')
        .pipe(gulpBabel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulpJs())
        .pipe(dest('./dist/static/js'))
        .pipe(gulpConnect.reload());
}

function handleImage() {
    return src('./src/static/images/*.*')
    .pipe(gulpImagemin({
        optimizationLevel: 5, //类型：Number 默认：5 取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(dest('./dist/static/images'))
    .pipe(gulpConnect.reload());
}

function handleWatch() {
    watch('./src/*.html', handleHtml);
    watch('./src/static/sass/*.scss', handleSass);
    watch('./src/static/js/*.js', handleJs);
    watch('./src/static/images/*.*', handleImage);
}


exports.default = series(parallel(handleHtml, handleSass, handleJs, handleImage), parallel(createServer, handleWatch));


