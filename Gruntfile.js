var reactify = require('reactify');

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			all: {
				files: 'src/**/*.js',
				tasks: ['default']
			}
		},

		pure_cjs: {
			options: {
				transform: [function (file) { return reactify(file, {es6: true}) }]
			},
			all: {
				files: {
					'index.js': 'src/index.js'
				}
			}
		}
	});

	grunt.registerTask('default', ['pure_cjs']);
};