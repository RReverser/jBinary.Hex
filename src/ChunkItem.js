/** @jsx React.DOM */

module.exports = React.createClass({
	render: function () {
		var offset = this.props.offset;

		return <span
			className={'value ' + this.props.formatterName + (offset === this.props.position ? ' current' : '')}
			onClick={this.props.onClick}>
			{this.props.formatter(this.props.data[offset])}
		</span>;
	}
});
