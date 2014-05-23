/** @jsx React.DOM */

var Tree = module.exports = React.createClass({
	displayName: 'Tree',

	getInitialState: function () {
		return {
			visible: true
		};
	},

	render: function () {
		var obj = this.props.object,
			isObject = typeof obj === 'object' && obj !== null,
			isArrayLike = isObject && typeof obj.length === 'number',
			childNodes = isObject && (!isArrayLike || obj.length < 256) ? Object.keys(obj).map(key => <li key={key}><Tree title={key} object={obj[key]} /></li>) : [],
			className = childNodes.length ? 'togglable togglable-' + (this.state.visible ? 'down' : 'up') : '';

		return <div className="tree-node">
			<h5 onClick={this.toggle} className={className}>
				{this.props.title}
				: {isObject ? obj.constructor.name + (isArrayLike ? '[' + obj.length + ']' : '') : typeof obj}
				{!isObject ? ' = ' + String(JSON.stringify(obj)) : ''}
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