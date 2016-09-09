/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-devtools');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    compress: false
                },
                files: {
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>ua-landing.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>ua-landing.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>ua-howto.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>ua-howto.less"
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
            files: ['*.htm', 'js/*', 'less/*'],
            tasks: ['less:development'],
            options: {
                livereload: true,
            }
        }
    });
    grunt.registerTask('default', ['watch']);
}
