module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
          options: {
              sourceMap: false,
              presets: ['es2015']
          },
          dist: {
              files: [{
                  expand: true,
                  cwd: '',
                  src: ['*.js', 'test/*.js', '!gruntfile.js'],
                  dest: 'dist',
                  ext: '.js'
              }]
          }
        },
        watch: {
            scripts: {
                files: ['*.js', 'test/*.js'],
                tasks: ["babel"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['babel', 'watch']);

};
