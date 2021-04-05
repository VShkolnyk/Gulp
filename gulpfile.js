const gulp = require('gulp');
const {series, parallel} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');


const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/style/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/style'))
}

const images = () => {
    return gulp.src('src/style/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/style/images'))
}

const fonts = () => {
    return gulp.src('src/style/Fonts/**/*.*')
        .pipe(gulp.dest('build/style/Fonts'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const  deleteBuild = (cd) => {
    return del('build/**/*.*').then(() => {cd()})
}

const watch = () => {
    gulp.watch("src/pug/**/*.pug", html)
    gulp.watch('src/style/**/*.scss', styles)
    gulp.watch('src/style/images/*.*', images)
    gulp.watch('src/style/Fonts/**/*.*', fonts)
}

exports.default = series (
    deleteBuild,
    parallel(html, styles, images, fonts),
    parallel(watch, server)
)