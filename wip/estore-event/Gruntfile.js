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
        less: {
            development: {
                options: {
                    compress: false,
                    plugins: [new(require('less-plugin-autoprefix'))({
                        browsers: ['> 1%', 'ie 9', 'last 2 versions']
                    })]
                },
                files: {
                    // "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>main.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>main.less",
                    //"<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>ua-howto.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>ua-howto.less"
                }
            },
            production: {
                options: {
                    compress: true,
                    plugins: [new(require('less-plugin-autoprefix'))({
                        browsers: ['> 1%', 'ie 9', 'last 2 versions']
                    })]
                },
                files: {
                    // "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.destPath %><%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>main.min.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>main.less",
                    //"<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>ua-howto.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>ua-howto.less"
                }
            },
        },
        uglify: {
            production: {
                files: {
                    '<%= pkg.destPath %><%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>main.min.js': ['<%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>/main.js']
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
                    '<%= pkg.destPath %>fsbs.htm': '<%= pkg.releaseFileName %>.htm',
                }
            }
        },
        copy: {
            production: {
                expand: true,
                src: ['<%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>plugins/**', '<%= pkg.rootAssetPath %><%= pkg.directories.jsFolder %>vendor/**'],
                dest: '<%= pkg.destPath %>',
            },
        },
        imagemin: {

            production: {
                options: {
                    use: [imageminJpegRecompress()]
                },
                files: [{
                    expand: true,
                    src: ['<%= pkg.rootAssetPath %><%= pkg.directories.imageFolder %><%= pkg.releaseFileName %>/**'], // Actual patterns to match
                    dest: '<%= pkg.destPath %>' // Destination path prefix
                }]
            }
        },
        watch: {
            files: ['*.htm', '<%= pkg.rootAssetPath %>js/*', '<%= pkg.rootAssetPath %>less/*', '<%= pkg.rootAssetPath %>less/lib/*'],
            tasks: ['less:development'],
            options: {
                livereload: true,
            }
        }
    });
    grunt.registerTask('prod', ['copy:production', 'uglify:production', 'less:production', 'targethtml:production', 'imagemin:production']);
    grunt.registerTask('default', ['watch']);
}
