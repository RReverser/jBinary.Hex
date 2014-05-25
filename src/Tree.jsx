var ifStyle = require('./utils').ifStyle;

var Tree = module.exports = React.createClass({
	displayName: 'Tree',

	getInitialState: function () {
		return {
			visible: !!this.props.alwaysVisible,
			childNodes: []
		};
	},

	render: function () {
		var obj = this.props.object,
			isObject = typeof obj === 'object' && obj !== null,
			split = this.props.split,
			keys = [],
			childNodes = [];

		if (isObject) {
			keys = this.props.keys || Object.keys(obj);
			
			if (this.state.visible) {
				if (keys.length > split) {
					// calculating optimal step that will produce no more than [split] elements and will be power of 10
					var step = Math.pow(10, Math.ceil(Math.log(Math.max(keys.length / split, split)) / Math.LN10));

					for (var i = 0, nextI, title; i < keys.length; i = nextI) {
						nextI = Math.min(i + step, keys.length);
						title = keys[i] + '..' + keys[nextI - 1];
						childNodes.push(<li key={title}><Tree title={title} split={split} keys={keys.slice(i, nextI)} object={obj} /></li>);
					}
				} else {
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						childNodes.push(<li key={key}><Tree title={key} split={split} object={obj[key]} /></li>);
					}
				}
			}
		}

		var text = (
			this.props.title +
			': ' +
			(isObject ? obj.constructor.name + (typeof obj.length === 'number' ? '[' + (isObject ? keys : obj).length + ']' : '') : JSON.stringify(obj))
		);

		return !isObject ? <h5>{text}</h5> : <div className="tree-node">
			<h5
				onClick={!this.props.alwaysVisible && this.toggle}
				className={this.props.alwaysVisible || !keys.length ? 'togglable-down' : 'togglable togglable-' + (this.state.visible ? 'down' : 'up')}
			>{text}</h5>
			<ul style={ifStyle(this.state.visible)}>{childNodes}</ul>
		</div>;
	},

	toggle: function () {
		this.setState({visible: !this.state.visible});
	}
});