var worker = new Worker('worker.js'),
	autoIncrement = 0;

module.exports = (type, data) => {
	var id = autoIncrement++;

	return new Promise((resolve, reject) => {
		worker.addEventListener('message', function handler(event) {
			var message = event.data;

			if (message.id === id) {
				worker.removeEventListener('message', handler);

				if ('data' in message) {
					resolve(message.data);
				} else {
					var errorInfo = message.error;
					var error = new window[errorInfo.name](errorInfo.message);
					error.stack = errorInfo.stack;
					reject(error);
				}
			}
		});

		worker.postMessage({
			id: id,
			type: type,
			data: data
		});
	});
};