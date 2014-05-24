module.exports = React.createClass({
	displayName: 'Ace',

	render: function () {
		return <div className="ace-editor" />;
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

		session.setValue(this.props.initialCode);

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