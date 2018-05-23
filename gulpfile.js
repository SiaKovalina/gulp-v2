var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');
var eslint = require('gulp-eslint');

//Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

//File paths
var DIST_PATH = 'public/dist'; //dist stands for distribution folder
var SCRIPTS_PATH = './public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var IMG_PATH = 'public/images/**/*.{png, jpeg, jpg, svg, gif}'

//Scripts task
gulp.task('scripts', function() {
    console.log('Starting scripts task');

    return gulp.src(['./public/scripts/main.js', './public/scripts/secondary-scripts.js', './public/scripts/scripts-3.js', './public/scripts/scripts-4.js'])
        .pipe(plumber(function(err) {
            console.log('Scripts task error');
            console.log(err);
            this.emit('end')
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(eslint({
            rules: {
                'my-custom-rule': 1,
                'strict': 2
            },
            globals: [
                'jQuery',
                '$',
                '_'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload())
});


// //Styles task
// gulp.task('styles', function() {
// //First it grabs the reset.css file, then what's left excluding reset.css because it already has been loaded
// //this way of sourcing the files tells Gulp in which order we want to concatinate the files
//     return gulp.src(['public/css/reset.css', CSS_PATH])
//     .pipe(plumber(function(err){
//         console.log('Styles task error');
//         console.log(err) //Logging the Error object
//         this.emit('end') //Keeping gulp up, but stop running the tasks, an enternal Gulp command
//     }))
//     .pipe(sourcemaps.init()) //soursemaps plugin detects how file looked before and after 
//     .pipe(autoprefixer({
//         browsers: ['last 2 versions', 'ie 8'] //this autoprefixer config is very english-like))
//     }))
//     .pipe(concat('styles.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write()) //soursemaps plugin detects how file looked before and after 
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload())
// });

//Styles task (sass)
gulp.task('styles', function() {
    //First it grabs the reset.css file, then what's left excluding reset.css because it already has been loaded
    //this way of sourcing the files tells Gulp in which order we want to concatinate the files
        return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function(err){
            console.log('Styles task error');
            console.log(err) //Logging the Error object
            this.emit('end') //Keeping gulp up, but stop running the tasks, an enternal Gulp command
        }))
        .pipe(sourcemaps.init()) //soursemaps plugin detects how file looked before and after 
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8'] //this autoprefixer config is very english-like))
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write()) //soursemaps plugin detects how file looked before and after 
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload())
});

gulp.task('images', function() {
    return gulp.src(IMG_PATH)
    .pipe(imagemin(
        [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminPngquant(),
            imageminJpegRecompress()
        ]
    ))
    pipe(gulp.dest(DIST_PATH + '/images'))
});

gulp.task('clean', function() {
    return del.sync([
        DIST_PATH
    ])
})

gulp.task('default', ['clean', 'images', 'scripts', 'styles'], function(){
    console.log('Starting default task');
});

// gulp.task('lint', function() {
//     return gulp.src(SCRIPTS_PATH)
//     .pipe(eslint())
//     .pipe(eslint.failAfterError());
// });

//Watch task
gulp.task('watch', ['default'], function() {
    console.log('Watch task started to run');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    //gulp.watch(CSS_PATH, ['styles'])
    gulp.watch('public/scss/styles.scss', ['styles'])
});
