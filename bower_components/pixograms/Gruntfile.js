module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webfont: {
            icons: {
                src: 'icons/*.svg',
                dest: 'fonts/pix',
                destCss: 'less',
                options: {
                    stylesheet: 'less',
                    font: 'pix',
                    ligatures: true,
                    engine: 'fontforge',
                    hashes: false,
                    template: 'templates/xem',
                    htmlDemoTemplate: 'templates/xem',
                    destHtml: '.'
                }
            }
        },
        watch: {
            files: ['icons/*.svg'],
            tasks: ['webfont']
        }
    });


grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-webfont');
grunt.registerTask('default', ['webfont']);

//grunt.loadNpmTasks('grunt-contrib-uglify');
//grunt.loadNpmTasks('grunt-contrib-jshint');
//grunt.loadNpmTasks('grunt-contrib-qunit');
//grunt.loadNpmTasks('grunt-contrib-concat');
//grunt.registerTask('test', ['jshint', 'qunit']);

};
