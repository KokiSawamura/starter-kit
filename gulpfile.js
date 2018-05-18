var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var ejs          = require('gulp-ejs');
var cleanCSS     = require('gulp-clean-css');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var spritesmith  = require('gulp.spritesmith');
var svgsprite    = require('gulp-svg-sprite');
var rename       = require('gulp-rename');
var fs           = require('fs');
var del          = require('del');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var runSequence  = require('run-sequence');

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: 'app',
    directory: true
  });

  gulp.watch('app/**/*.ejs', ['ejs']);
  gulp.watch('app/**/*.scss', ['sass']);
  gulp.watch(['app/**/*.html', 'app/**/*.js', 'app/**/*.css', 'app/**/*.png', 'app/**/*.svg', 'app/**/*.jpg', 'app/**/*.gif']).on('change', browserSync.reload);
});

gulp.task('ejs', function () {
  var json = JSON.parse(fs.readFileSync('./package.json'));
  return gulp.src('app/**/[^_]*.ejs')
    .pipe(ejs(json, {root: __dirname + '/app'}, {ext: '.html'}))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src('app/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

gulp.task('minify-css', function () {
  return gulp.src(['dist/**/*.css', '!dist/**/*.min.css'])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-js', function () {
  return gulp.src(['dist/**/*.js', '!dist/**/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('optimize', function () {
  return gulp.src(['app/**/*.png', 'app/**/*.jpg', 'app/**/*.svg', 'app/**/*.gif'])
    .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
    .pipe(gulp.dest('app'))
});

gulp.task('autoprefixer', function() {
  return gulp.src('app/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app'))
});

gulp.task('sprite', function () {
  let spriteData = gulp.src('app/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    retinaSrcFilter: 'app/sprite/*@2x.png',
    retinaImgName: 'sprite@2x.png',
  }));
  spriteData.img
    .pipe(gulp.dest('app/sprite/dist'));
  return spriteData.css
    .pipe(gulp.dest('app/sprite/dist'));
});
gulp.task('svgsprite', function () {
  return gulp.src('sprite/*.svg')
    .pipe(svgsprite({
      mode: {
        css: {
          dest: 'sass',
          sprite: 'sprite.svg',
          render: {
            scss: {
              dest: '_sprite.scss'
            }
          },
          bust: false
        }
      }
    }))
    .pipe(gulp.dest('sprite'))
});

gulp.task('clean', del.bind(null, 'dist'));

gulp.task('copy', function () {
  return gulp.src(['app/**/[^_]*', '!app/**/*.ejs', '!app/**/*.scss'])
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (callback) {
  return runSequence('clean', 'autoprefixer', 'copy', ['minify-css', 'minify-js'], callback);
});

gulp.task('default', ['serve']);