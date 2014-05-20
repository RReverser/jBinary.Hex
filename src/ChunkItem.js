/** @jsx React.DOM */

module.exports = React.createClass({
	shouldComponentUpdate: function (props) {
		var oldPosition = this.props.position,
			newPosition = props.position,
			offset = this.props.offset;

		return (offset === oldPosition) || (offset === newPosition);
	},

	render: function () {
		var offset = this.props.offset;

		return <span className={'value ' + this.props.formatterName + (offset === this.props.position ? ' current' : '')} data-offset={offset} onClick={this.props.onClick}>
			{this.props.formatter(this.props.data[offset])}
		</span>;
	}
});