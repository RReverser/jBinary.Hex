importScripts(
	'//jdataview.github.io/dist/jdataview.js',
	'//jdataview.github.io/dist/jbinary.js'
);

var whenBinary;

exports.handleFile = file => {
	whenBinary = jBinary.load(file);
	return whenBinary.then(binary => binary.read('blob'));
};

exports.parse = sourceCode => {
	var module = {};
	
	new Function('require', 'module', 'exports', sourceCode)(
		function (name) { return {jdataview: jDataView, jbinary: jBinary}[name] },
		module,
		module.exports = {}
	);

	return whenBinary.then(binary => binary.as(module.exports).readAll());
};