/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-devtools');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            developmentLtr: {
                options:
                {
                    compress: false,
                    plugins: [
                        new(require('less-plugin-autoprefix'))(
                        {
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        }),
                        new(require('less-plugin-rtl'))({
                            dir: 'LTR'
                        })
                    ]
                },
                files: {
                    // "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>downtime.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>downtime.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>modal.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>modal.less"
                }
            },
            developmentRtl: {
                options:
                {
                    compress: false,
                    plugins: [
                        new(require('less-plugin-autoprefix'))(
                        {
                            browsers: ['> 1%', 'ie 9', 'last 2 versions']
                        }),
                        new(require('less-plugin-rtl'))({
                            dir: 'RTL'
                        })
                    ]
                },
                files: {
                    // "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>downtime.rtl.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>downtime.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>modal.rtl.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>modal.less"
                }
            },
            production: {
                options: {
                    compress: true
                },
                files: [{
                    expand: true,
                    src: ['<%= pkg.finalFolderPath %>less/support.output.*.less', '<%= pkg.finalFolderPath %>less/support.main.required.*.less'],
                    dest: '<%= pkg.finalFolderPath %>css',
                    extDot: 'first',
                    rename: function(dest, src) {

                        var _new_ext = 'css';

                        //Get src filename
                        src = src.split("/");
                        var filename = src.pop();

                        //Apply new extension to filename
                        var arr = filename.split(".");
                        arr.pop();
                        arr.push(_new_ext);
                        filename = arr.join(".");

                        return dest + '/' + filename;
                    }
                }]
            },
        },
        watch: {
            files: ['*.htm','*/*.htm', '<%= pkg.rootAssetPath %>js-src/*', '<%= pkg.rootAssetPath %>less/*', '<%= pkg.rootAssetPath %>less/lib/*'],
            tasks: ['less:developmentLtr','less:developmentRtl'],
            options: {
                livereload: true,
            }
        }
    });
    grunt.registerTask('default', ['watch']);
}
