/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-devtools');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    var imageminJpegRecompress = require('imagemin-jpeg-recompress');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        defaultJsPath: '<%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>',
        defaultLessPath: '<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>',
        defaultCssPath: '<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>',
        defaultImgPath: '<%= pkg.rootAssetPath %><%= pkg.directories.imageFolder %>',
        less: {
            fileList: ['buy-improvement.less','fake-header-footer.less'],
            development: {
                options: {
                    compress: '<%= compressLess %>',
                    plugins: [
                        new(require('less-plugin-rtl'))({
                            dir: 'LTR'
                        }),
                        new(require('less-plugin-autoprefix'))({
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: ['<%= less.fileList %>'],
                    dest: '<%= defaultCssPath %>',
                    cwd: '<%= defaultLessPath %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            },
            developmentRTL: {
                options: {
                    compress: '<%= compressLess %>',
                    plugins: [
                        new(require('less-plugin-rtl'))({
                            dir: 'RTL'
                        }),
                        new(require('less-plugin-autoprefix'))({
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: ['<%= less.fileList %>'],
                    dest: '<%= defaultCssPath %>',
                    cwd: '<%= defaultLessPath %>',
                    ext: '.rtl.css',
                    extDot: 'last'
                }]
            },
            production: {
                options: {
                    compress: '<%= compressLess %>',
                    plugins: [
                        new(require('less-plugin-rtl'))({
                            dir: 'LTR'
                        }),
                        new(require('less-plugin-autoprefix'))({
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: ['<%= less.fileList %>'],
                    dest: '<%= defaultCssPath %>',
                    cwd: '<%= defaultLessPath %>',
                    ext: '.min.css',
                    extDot: 'last'
                }]
            },
            productionRTL: {
                options: {
                    compress: '<%= compressLess %>',
                    plugins: [
                        new(require('less-plugin-rtl'))({
                            dir: 'RTL'
                        }),
                        new(require('less-plugin-autoprefix'))({
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: ['<%= less.fileList %>'],
                    dest: '<%= defaultCssPath %>',
                    cwd: '<%= defaultLessPath %>',
                    ext: '.rtl.min.css',
                    extDot: 'last'
                }]
            }
        },
        uglify: {
            production: {
                files: {
                    '<%= defaultJsPath %>buy-improvement.min.js': ['<%= defaultJsPath %>/buy-improvement.js']
                }
            }
        },
        targethtml: {
            options: {
                curlyTags: {
                    rlsdate: '<%= grunt.template.today("yyyymmdd") %>'
                }
            },
            production: {
                files: {
                    '<%= pkg.destPath %>default.htm': 'default.htm'
                }
            }
        },
        imagemin: {

            production: {
                options: {
                    use: [imageminJpegRecompress()]
                },
                files: [{
                    expand: true,
                    src: ['<%= defaultImgPath %>*.{png,jpg,gif}'], // Actual patterns to match
                    dest: '<%= pkg.destPath %>' // Destination path prefix
                }]
            }
        },
        copy: {
            production: {
                expand: true,
                src: ['<%= defaultJsPath %>plugins/**', '<%= defaultJsPath %>vendor/**'],
                dest: '<%= pkg.destPath %>',
            },
        },
        watch: {
            files: ['*.htm', '<%= defaultJsPath %>*', '<%= defaultLessPath %>*', '<%= defaultLessPath %>lib/*'],
            tasks: ['less:development', 'less:developmentRTL'],
            options: {
                livereload: true,
            }
        }
    });
    grunt.registerTask('prod', 'production build', function() {
        grunt.config.set('compressLess', true);
        grunt.task.run(['copy:production', 'uglify:production', 'less:production', 'targethtml:production', 'imagemin:production']);
    });
    grunt.registerTask('default', 'watch files updated and develop build', function() {
        grunt.config.set('compressLess', false);
        grunt.task.run(['watch']);
    });
}