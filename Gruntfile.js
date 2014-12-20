module.exports = function(grunt) {
	grunt.initConfig({
	  connect: {
	    server: {
	      options: {
	        port: 9003,
	        keepalive: true
	      }
	    }
	  }
	});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['connect']);

};