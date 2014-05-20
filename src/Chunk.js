/** @jsx React.DOM */

var ChunkItem = require('./ChunkItem');

module.exports = React.createClass({
	shouldComponentUpdate: function (props) {
		var oldPosition = this.props.position,
			newPosition = props.position,
			from = props.offset,
			to = from + this.props.delta;

		return ((oldPosition >= from && oldPosition < to) || (newPosition >= from && newPosition < to));
	},

	render: function () {
		var items = [],
			formatter = this.props.formatter,
			formatterName = this.props.formatterName,
			position = this.props.position,
			data = this.props.data;

		for (var i = this.props.offset, maxI = Math.min(this.props.data.length, i + this.props.delta); i < maxI; i++) {
			items.push(<ChunkItem
				data={this.props.data}
				key={i}
				offset={i}
				position={position}
				formatter={formatter}
				formatterName={formatterName}
				onClick={this.props.onItemClick} />);
		}

		return <td className={formatterName + 'group'}>{items}</td>;
	}
});