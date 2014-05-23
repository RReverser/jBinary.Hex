/** @jsx React.DOM */

module.exports = React.createClass({
	displayName: 'Ace',

	render: function () {
		return <div className="ace-editor">{
			"var jDataView = require('jdataview');\n" +
			"var jBinary = require('jbinary');\n" +
			"\n" +
			"module.exports = {\n" +
			"    'jBinary.all': 'File',\n" +
			"\n"+
			"    File: {\n" +
			"        byte: 'uint8',\n" +
			"        str: ['string', 10]\n" +
			"    }\n" +
			"};"
		}</div>;
	},

	componentDidMount: function () {
		var editor = ace.edit(this.getDOMNode()),
			session = editor.getSession();

		this.setState({
			editor: editor,
			session: session,
			theme: this.props.theme,
			mode: this.props.mode
		});

		this.props.sessionWasCreated(session);
	},

	componentWillUnmount: function () {
		this.state.editor.destroy();
	},

	componentDidUpdate: function (prevProps, prevState) {
		var state = this.state;

		prevState = prevState || {};

		if (prevState.theme !== state.theme) {
			state.editor.setTheme(state.theme);
		}

		if (prevState.mode !== state.mode) {
			state.session.setMode(state.mode);
		}
	}
});