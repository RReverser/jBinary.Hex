/** @jsx React.DOM */

var Chunk = require('./Chunk');
var toHex = require('./utils').toHex;

var HEIGHT = 20;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			start: 0
		};
	},

	onScroll: function(event) {
		var newStart = Math.floor(event.target.scrollTop / HEIGHT);
		if (newStart !== this.state.start) {
			this.setState({start: newStart});
		}
	},

	render: function () {
		var rows = [],
			data = this.props.data,
			position = this.props.position,
			delta = this.props.delta;

		var totalLines = 0;
		if (data) {
			totalLines = Math.ceil(data.length / delta);
			for (var i = this.state.start; i < Math.min(this.state.start + this.props.lines, totalLines); ++i) {
				rows.push(<tr key={i - this.state.start}>
					<td className="offset">{toHex(i, 8)}</td>
					<Chunk
						data={data}
						position={position}
						offset={i * delta}
						delta={delta}
						formatter={data => toHex(data, 2)}
						formatterName="hex"
						onItemClick={this.props.onItemClick} />
					<Chunk
						data={data}
						position={position}
						offset={i * delta}
						delta={delta}
						formatter={data => data <= 32 ? ' ' : String.fromCharCode(data)}
						formatterName="char"
						onItemClick={this.props.onItemClick} />
				</tr>);
			}
		}

		return <div className="binary-wrapper" style={{height: this.props.lines * HEIGHT}} onScroll={this.onScroll}>
			<table className="binary" cols={delta}>
				<tbody>{rows}</tbody>
			</table>
			<div style={{height: totalLines * HEIGHT}} />
		</div>;
	}
});