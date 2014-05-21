/** @jsx React.DOM */

var ChunkItem = require('./ChunkItem');

module.exports = React.createClass({
	displayName: 'Chunk',

	render: function () {
		var items = [],
			formatter = this.props.formatter,
			formatterName = this.props.key,
			position = this.props.position,
			data = this.props.data,
			start = this.props.offset,
			end = Math.min(data.length, start + this.props.delta),
			onItemClick = this.props.onItemClick;

		for (var i = start; i < end; i++) {
			items.push(<ChunkItem
				data={data[i]}
				key={i - start}
				offset={i}
				position={position}
				formatter={formatter}
				formatterName={formatterName}
				onClick={onItemClick} />);
		}

		return <td className={formatterName + 'group'}>{items}</td>;
	}
});
