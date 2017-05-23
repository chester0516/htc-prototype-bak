/*global require*/
/*Required*/
var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    less = require('gulp-less'),
    gulpIf = require('gulp-if'),
    rename = require('rename'),
    gulpRename = require('gulp-rename'),
    lessChanged = require('gulp-less-changed'),
    lessPluginAutoprefix = require('less-plugin-autoprefix'),
    lessPluginRtl = require('less-plugin-rtl'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    path = require('path'),
    util = require('gulp-util'),
    pump = require('pump'),
    dirSync = require('gulp-dir-sync'),
    changed = require('gulp-changed'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload');
/*Settings*/
var config = {
    isDev: !util.env.prod
};
var assets = {
    root: 'ek-assets/digital-first/',
    less: 'less/',
    css: 'css/',
    js: {
        src: 'js-src/',
        dest: 'js/'
    },
    img: {
        src: 'img-src/',
        dest: 'img/',
        destRtl: 'img-mea/'
    }
};
var paths = {
    less: assets.root + assets.less,
    css: assets.root + assets.css,
    jsSrc: assets.root + assets.js.src,
    jsDest: assets.root + assets.js.dest,
    imgSrc: assets.root + assets.img.src,
    imgDest: assets.root + assets.img.dest,
    imgDestRtl: assets.root + assets.img.destRtl,
    asp: 'templates/support/*.{aspx,aspx.cs}'
};
/*Functions*/
var buildLess = function(direction) {
    'use strict';
    console.log('direction=' + direction);
    var condition = (direction === 'RTL') ? true : false;
    var extFilename = (direction === 'RTL') ? '.rtl.css' : '.css';
    gulp.src(paths.less + '/*.less').pipe(gulpIf(config.isDev,lessChanged({
        //Changed LESS will be compiled to css
        //If @import LESS changed, related LESS will be compiled as well
        getOutputFileName: function(file) {
            return rename(file, {
                dirname: paths.css,
                extname: extFilename
            });
        }
    }))).pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')],
        plugins: [
            new lessPluginAutoprefix({
                browsers: ['> 1%', 'ie 9', 'last 2 versions']
            }),
            new lessPluginRtl({
                dir: direction
            })
        ]
    })).pipe(gulpIf(config.isDev, sourcemaps.init())).pipe(cleanCSS()).pipe(gulpIf(config.isDev, sourcemaps.write())).pipe(gulpIf(condition, gulpRename({
        extname: extFilename
    }))).pipe(gulp.dest(paths.css)).pipe(livereload());
};
/*Tasks*/
gulp.task('less', function() {
    'use strict';
    buildLess('LTR');
    buildLess('RTL');
});
gulp.task('jsUglify', function(callback) {
    'use strict';
    pump([
        gulp.src(paths.jsSrc + '**/*.js'),
        gulpIf(config.isDev,changed(paths.jsDest)),
        gulpIf(config.isDev,sourcemaps.init()),
        uglify(),
        gulpIf(config.isDev,sourcemaps.write()),
        gulp.dest(paths.jsDest),
        livereload()
    ], callback);
});
//image minify
//sync files
gulp.task('syncJsLib', function() {
    'use strict';
    //===== COPY FILES =====
    // pump([
    //     gulp.src(paths.jsSrc + 'lib/**/*'),
    //     changed(paths.jsDest + 'lib/'),
    //     gulp.dest(paths.jsDest + 'lib/')
    // ], callback);
    //
    //===== dirSync will add and delete files =====
    dirSync(paths.jsSrc + 'lib/', paths.jsDest + 'lib/');
});
gulp.task('syncImages', function() {
    'use strict';
    //===== New Images =====
    pump([
        gulp.src(paths.imgSrc + '**'),
        newer(paths.imgDest),
        imagemin(),
        gulp.dest(paths.imgDest)
    ]);
    //===== Updated Images =====
    pump([
        gulp.src(paths.imgSrc + '**'),
        changed(paths.imgDest),
        imagemin(),
        gulp.dest(paths.imgDest)
    ]);
});
gulp.task('webserver', function() {
    'use strict';
    gulp.src('./').pipe(webserver({
        host: 'p1.htc.com',
        port: 9487,
        livereload: true,
        directoryListing: true,
        open: true,
        path: '/',
        fallback: 'default.htm'
    }));
});
gulp.task('watch', function() {
    'use strict';
    livereload.listen();
    /* Detect all less files, include lib folder */
    gulp.watch(paths.less + '/**/*.less', ['less']);
    gulp.watch(paths.jsSrc + '/**/*.js', ['jsUglify', 'syncJsLib']);
    
    gulp.watch(paths.asp, function (file) {
        livereload.changed(file.path);
    });
});

gulp.task('default', ['webserver', 'watch']);
gulp.task('syncAssets', ['syncJsLib', 'syncImages']);
gulp.task('prod', ['less','jsUglify']);