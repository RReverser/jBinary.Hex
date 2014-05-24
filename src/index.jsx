var Editor = require('./Editor');

addEventListener('DOMContentLoaded', function () {
	React.renderComponent(<Editor delta={32} lines={20} />, document.body);
});
