/** @jsx React.DOM */

var Tree = module.exports = React.createClass({
	displayName: 'Tree',

	getInitialState: function () {
		return {
			visible: this.props.visible
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
					for (var i = 0, nextI, title; i < keys.length; i = nextI) {
						nextI = Math.min(i + split, keys.length);
						title = keys[i] + '..' + keys[nextI - 1];
						childNodes.push(<li key={title}><Tree title={title} visible={false} split={split} keys={keys.slice(i, nextI)} object={obj} /></li>);
					}
				} else {
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						childNodes.push(<li key={key}><Tree title={key} visible={false} split={split} object={obj[key]} /></li>);
					}
				}
			}
		}

		return <div className="tree-node">
			<h5 onClick={this.toggle} className={keys.length ? 'togglable togglable-' + (this.state.visible ? 'down' : 'up') : ''}>
				{this.props.title}
				: {isObject ? obj.constructor.name : typeof obj}{obj && typeof obj.length === 'number' ? '[' + obj.length + ']' : ''}
				{!isObject ? ' = ' + JSON.stringify(obj) : ''}
			</h5>
			<ul style={this.state.visible ? {} : {display: 'none'}}>
				{childNodes}
			</ul>
		</div>;
	},

	toggle: function () {
		this.setState({visible: !this.state.visible});
	}
});