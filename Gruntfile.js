var reactify = require('reactify');

module.exports = function (grunt) {
	grunt.initConfig({
		watch: {
			all: {
				files: 'src/**/*',
				tasks: ['default']
			}
		},

		pure_cjs: {
			options: {
				transform: [function (file) { return reactify(file, {es6: true}) }],
				defaultExt: 'jsx'
			},
			all: {
				files: {
					'index.js': 'src/index.jsx',
					'worker.js': 'src/worker.jsx'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-pure-cjs');

	grunt.registerTask('default', ['pure_cjs']);
};