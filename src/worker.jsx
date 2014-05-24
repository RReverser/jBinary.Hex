importScripts(
	'//s3.amazonaws.com/es6-promises/promise-1.0.0.min.js',
	'//jdataview.github.io/dist/jdataview.js',
	'//jdataview.github.io/dist/jbinary.js'
);

var msgHandlers = {};

addEventListener('message', event => {
	var message = event.data;

	Promise.resolve(message.data).then(msgHandlers[message.type]).then(
		data => {
			postMessage({
				id: message.id,
				data: data
			});
		},
		error => {
			postMessage({
				id: message.id,
				error: {
					name: error.name,
					message: JSON.stringify(error.message),
					stack: error.stack
				}
			})
		}
	);
});

var whenBinary;

msgHandlers.handleFile = file => {
	whenBinary = jBinary.load(file);
	return whenBinary.then(binary => binary.read('blob'));
};

msgHandlers.parse = sourceCode => {
	var module = {};
	
	new Function('require', 'module', 'exports', sourceCode)(
		function (name) { return {jdataview: jDataView, jbinary: jBinary}[name] },
		module,
		module.exports = {}
	);

	return whenBinary.then(binary => binary.as(module.exports).readAll());
};