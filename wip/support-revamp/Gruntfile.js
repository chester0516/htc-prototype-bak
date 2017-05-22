/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-devtools');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        defaultJsSourcePath: '<%= pkg.rootAssetPath %><%= pkg.directories.jsSourceFolder %>',
        defaultJsPath: '<%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>',
        defaultImgSourcePath: '<%= pkg.rootAssetPath %><%= pkg.directories.imageSourceFolder %>',
        defaultImgPath: '<%= pkg.rootAssetPath %><%= pkg.directories.imageFolder %>',
        defaultLessPath: '<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>',
        defaultCssPath: '<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>',
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },
        },
        copy: {
            development: {
                files: [{
                    expand: true,
                    cwd: '<%= defaultJsSourcePath %>',
                    src: '**/*.js',
                    dest: '<%= defaultJsPath %>'
                }, {
                    expand: true,
                    cwd: '<%= defaultImgSourcePath %>',
                    src: '**/*.{png,jpg,gif,svg}',
                    dest: '<%= defaultImgPath %>'
                }]
            }
        },
        less: {
            fileList: ['applications-content.less',
                'applications-landing.less',
                'backup-transfer-content.less',
                'backup-transfer.less',
                'contact-support.less',
                'default.less',
                'email.less',
                'livechat.less',
                'product-landing.less',
                'search-result.less',
                'sync-manager.less',
                'updates.less'
            ],
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
                    ext: '.css',
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
                    ext: '.rtl.css',
                    extDot: 'last'
                }]
            },
        },
        uglify: {
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= defaultJsSourcePath %>',
                    src: '*.js',
                    dest: '<%= defaultJsPath %>'
                },
                {
                    expand: true,
                    cwd: '<%= defaultJsSourcePath %>',
                    src: 'lib/*.js',
                    dest: '<%= defaultJsPath %>'
                }]
            }
        },
        imagemin: { // Task
            production: { // Another target
                files: [{
                    expand: true,
                    cwd: '<%= defaultImgSourcePath %>',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= defaultImgPath %>'
                }]
            }
        },
        watch: {
            css: {
                files: ['<%= defaultLessPath %>*', '<%= defaultLessPath %>lib/*'],
                tasks: ['less:development', 'less:developmentRTL'],
                options: {
                    livereload: true,
                }
            },
            js: {
                files: ['<%= defaultJsSourcePath %>*.js', '<%= defaultJsSourcePath %>vendor/*.js', '<%= defaultJsSourcePath %>plugins/*.js', '<%= defaultJsSourcePath %>lib/*.js'],
                tasks: ['jshint', 'copy:development'],
                options: {
                    livereload: true,
                }
            },
            image: {
                files: ['<%= defaultImgSourcePath %>**/*.{png,jpg,gif,svg}'],
                tasks: ['copy:development'],
                options: {
                    livereload: true,
                }
            },
            html: {
                files: ['*.html', '*.htm'],
                options: {
                    livereload: true,
                }
            }
        }
    });
    // grunt.registerTask('default', ['watch']);
    grunt.registerTask('default', 'watch files updated and develop build', function() {
        grunt.config.set('compressLess', false);
        grunt.task.run(['watch']);
    });
    grunt.registerTask('prod', 'production build', function() {
        grunt.config.set('compressLess', true);
        grunt.task.run(['less:production', 'less:productionRTL', 'uglify:production']);
    });
}