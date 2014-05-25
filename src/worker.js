importScripts('//s3.amazonaws.com/es6-promises/promise-1.0.0.min.js');

var msgHandlers = require('./workerHandlers');

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
					message: error.message,
					stack: error.stack
				}
			})
		}
	);
});