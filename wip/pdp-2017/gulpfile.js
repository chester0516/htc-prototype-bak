/*global require*/
/*Required*/
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var gulpIf = require('gulp-if');
var rename = require('rename');
var gulpRename = require('gulp-rename');
var lessChanged = require('gulp-less-changed');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var lessPluginRtl = require('less-plugin-rtl');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var pump = require('pump');
var dirSync = require('gulp-dir-sync');
var changed = require('gulp-changed');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
/*Settings*/
var assets = {
    root: 'assets/layout/',
    less: 'less/',
    css: 'css/',
    js: {
        src: 'js-src/',
        dest: 'js/'
    },
    img: {
        src: 'img-src/pdp-2017/',
        dest: 'img/pdp-2017/',
        destRtl: 'img-mea/pdp-2017/'
    }
};
var paths = {
    less: assets.root + assets.less,
    css: assets.root + assets.css,
    jsSrc: assets.root + assets.js.src,
    jsDest: assets.root + assets.js.dest,
    imgSrc: assets.root + assets.img.src,
    imgDest: assets.root + assets.img.dest,
    imgDestRtl: assets.root + assets.img.destRtl
};
/*Functions*/
var buildLess = function(direction) {
    'use strict';
    console.log('direction=' + direction);
    var condition = (direction === 'RTL') ? true : false;
    var extFilename = (direction === 'RTL') ? '.rtl.css' : '.css';
    gulp.src(paths.less + '/*.less').pipe(lessChanged({
        //Changed LESS will be compiled to css
        //If @import LESS changed, related LESS will be compiled as well
        getOutputFileName: function(file) {
            return rename(file, {
                dirname: paths.css,
                extname: extFilename
            });
        }
    })).pipe(less({
        plugins: [
            new lessPluginAutoprefix({
                browsers: ['> 1%', 'ie 9', 'last 2 versions']
            }),
            new lessPluginRtl({
                dir: direction
            })
        ]
    })).pipe(sourcemaps.init()).pipe(cleanCSS()).pipe(sourcemaps.write()).pipe(gulpIf(condition, gulpRename({
        extname: extFilename
    }))).pipe(gulp.dest(paths.css));
};
/*Tasks*/
gulp.task('lessLtr', function() {
    'use strict';
    buildLess('LTR');
});
gulp.task('lessRtl', function() {
    'use strict';
    buildLess('RTL');
});
gulp.task('jsUglify', function(callback) {
    'use strict';
    pump([
        gulp.src(paths.jsSrc + '*.js'),
        changed(paths.jsDest),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write(),
        gulp.dest(paths.jsDest)
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
        fallback: 'us/go/launch/launch.htm'
    }));
});
gulp.task('watch', function() {
    'use strict';
    /* Detect all less files, include lib folder */
    gulp.watch(paths.less + '/**/*.less', ['lessLtr', 'lessRtl']);
    gulp.watch(paths.jsSrc + '/**/*.js', ['jsUglify', 'syncJsLib']);
    gulp.watch("**/*.htm").on('change', browserSync.reload);
});
gulp.task('default', ['webserver', 'watch']);
gulp.task('syncAssets', ['syncImages', 'syncJsLib']);