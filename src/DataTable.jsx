var Chunk = require('./Chunk');
var toHex = require('./utils').toHex;

var HEIGHT = 20;

module.exports = React.createClass({
	displayName: 'DataTable',

	getInitialState: function () {
		return {
			start: 0
		};
	},

	onScroll: function (event) {
		var newStart = Math.floor(event.target.scrollTop / HEIGHT);
		
		if (newStart === this.state.start) {
			return;
		}

		console.time('scroll');
		this.setState({start: newStart}, () => { console.timeEnd('scroll') });
	},

	componentWillReceiveProps: function (props) {
		if (!props.data) {
			return;
		}

		var delta = props.delta,
			line = Math.floor(props.position / delta),
			start = this.state.start,
			totalLines = Math.ceil(props.data.length / delta),
			end = Math.min(start + props.lines, totalLines);

		if (line < start) {
			this.setState({
				start: line
			});
		} else
		if (line >= end) {
			this.setState({
				start: start + (line - end) + 1
			});
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

			for (var i = this.state.start, maxI = Math.min(this.state.start + this.props.lines, totalLines); i < maxI; i++) {
				rows.push(<tr key={i}>
					<td className="offset">{toHex(i * delta, 8)}</td>
					<Chunk
						data={data}
						position={position}
						offset={i * delta}
						delta={delta}
						formatter={data => toHex(data, 2)}
						key="hex"
						onItemClick={this.props.onItemClick} />
					<Chunk
						data={data}
						position={position}
						offset={i * delta}
						delta={delta}
						formatter={data => data <= 32 ? ' ' : String.fromCharCode(data)}
						key="char"
						onItemClick={this.props.onItemClick} />
				</tr>);
			}
		}

		return <div className="binary-wrapper" style={{height: this.props.lines * HEIGHT}} scrollTop={this.state.start * HEIGHT} onScroll={this.onScroll}>
			<table className="binary" cols={delta}>
				<tbody>{rows}</tbody>
			</table>
			<div className="scrollable-wrapper"><div style={{height: totalLines * HEIGHT}} /></div>
		</div>;
	}
});
