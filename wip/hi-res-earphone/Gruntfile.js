/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-devtools');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options:
                {
                    compress: false,
                    plugins: [new(require('less-plugin-autoprefix'))(
                    {
                        browsers: ['> 1%', 'ie 9', 'last 2 versions']
                    })]
                },
                files: {
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>fake-header-footer.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>fake-header-footer.less",
                    "<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>product2016.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>product2016.less",
                    //"<%= pkg.rootAssetPath %><%= pkg.directories.cssFolder %>ua-howto.css": "<%= pkg.rootAssetPath %><%= pkg.directories.lessFolder %>ua-howto.less"
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
            files: ['*.htm', '<%= pkg.rootAssetPath %>js/*', '<%= pkg.rootAssetPath %>less/*'],
            tasks: ['less:development'],
            options: {
                livereload: true,
            }
        }
    });
    grunt.registerTask('default', ['watch']);
}
