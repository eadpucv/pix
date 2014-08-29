module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	    webfont: {
		  icons: {
		    src: 'icons/*.svg',
		    dest: 'build/fonts',
		    options: {
			font: 'PiX',
			ligatures: true,
			engine: 'fontforge'
    			}
  		}
	},
    watch: {
      files: ['icons/*.svg'],
      tasks: ['webfont']
    }
  });

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webfont');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['webfont']);

};
