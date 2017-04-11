/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    var libsDir = 'libs';
    // Project configuration.
    grunt.initConfig({
        copy: {
            development: {
                files: [
                    {
                        expand: true,
                        cwd: libsDir + '/jquery/dist',
                        src: 'jquery.{min.,}js',
                        dest: libsDir + '/jquery'
                    },
                    {
                        expand: true,
                        cwd: libsDir + '/knockout/dist',
                        src: 'knockout.{debug.,}js',
                        dest: libsDir + '/knockout'
                    },
                    {
                        expand: true,
                        cwd: libsDir + '/js-signals/dist',
                        src: 'signals{.min,}.js',
                        dest: libsDir + '/js-signals'
                    },
                    {
                        expand: true,
                        cwd: libsDir + '/oraclejet/dist',
                        src: '**',
                        dest: libsDir + '/oraclejet'
                    },
                    {
                        expand: true,
                        cwd: libsDir + '/proj4/dist',
                        src: 'proj4{-src,}.js',
                        dest: libsDir + '/proj4'
                    },
                    {
                        expand: true,
                        cwd: libsDir,
                        src: 'font-awesome/{css,fonts}/*.*',
                        dest: 'css'
                    }
                ]
            }
        },
        clean: {
            options: {
//                'no-write': true
            },
            development: {
                src: [
                    libsDir + '/**/.bower.json',
                    libsDir + '/**/.gitignore',
                    libsDir + '/es6-promise/*', '!' + libsDir + '/es6-promise/es6-promise.{min.,}js',
                    libsDir + '/hammerjs/*', '!' + libsDir + '/hammerjs/hammer.{min.,}js',
                    libsDir + '/jquery/*', '!' + libsDir + '/jquery/jquery.{min.,}js',
                    libsDir + '/jquery-ui/*.*', '!' + libsDir + '/jquery-ui/jquery-ui.{min.,}js',
                    libsDir + '/knockout/*', '!' + libsDir + '/knockout/knockout.{debug.,}js',
                    libsDir + '/js-signals/{dist,*.*}', '!' + libsDir + '/js-signals/signals.{min.,}js',
                    libsDir + '/oraclejet/{dist,*.*}',
                    libsDir + '/proj4/*', '!' + libsDir + '/proj4/proj4{-src,}.js',
                    libsDir + '/require-css/*', '!' + libsDir + '/require-css/{normalize,css{.min,-builder,}}.js',
                    libsDir + '/requirejs/*', '!' + libsDir + '/requirejs/require.js',
                    libsDir + '/text/*', '!' + libsDir + '/text/text.js',
                    libsDir + '/webcomponentsjs/*', '!' + libsDir + '/webcomponentsjs/CustomElements{.min,}.js',
                    libsDir + '/font-awesome'
                ]
            },
            production: {

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy', 'clean']);
};
