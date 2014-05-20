/** @jsx React.DOM */

var Chunk = require('./Chunk');
var toHex = require('./utils').toHex;

module.exports = React.createClass({
	render: function () {
		var rows = [],
			data = this.props.data,
			position = this.props.position,
			delta = this.props.delta;

		if (data) {
			for (var i = 0, length = data.length; i < length; i += delta) {
				rows.push(<tr key={i}>
					<td className="offset">{toHex(i, 8)}</td>
					<Chunk
						data={data}
						position={position}
						offset={i}
						delta={delta}
						formatter={data => toHex(data, 2)}
						formatterName="hex"
						onItemClick={this.props.onItemClick} />
					<Chunk
						data={data}
						position={position}
						offset={i}
						delta={delta}
						formatter={data => data <= 32 ? ' ' : String.fromCharCode(data)}
						formatterName="char"
						onItemClick={this.props.onItemClick} />
				</tr>);
			}
		}

		return <div className="binary-wrapper">
			<table className="binary" cols={delta}>
				<tbody>{rows}</tbody>
			</table>
		</div>;
	}
});