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
						onItemClick={this.handleItemClick} />
					<Chunk
						data={data}
						position={position}
						offset={i * delta}
						delta={delta}
						formatter={data => data <= 32 ? ' ' : String.fromCharCode(data)}
						key="char"
						onItemClick={this.handleItemClick} />
				</tr>);
			}
		}

		return <div className="binary-wrapper" tabIndex={0} style={{height: this.props.lines * HEIGHT}} scrollTop={this.state.start * HEIGHT} onKeyDown={this.onKeyDown} onScroll={this.onScroll}>
			<div className="scrollable-wrapper"><div style={{height: totalLines * HEIGHT}} /></div>
			<table className="binary" cols={delta}>
				<tbody>{rows}</tbody>
			</table>
		</div>;
	},

	handleItemClick: function (event) {
		this.props.setPosition(event.target.dataset.offset);
		this.getDOMNode().focus();
	},

	onKeyDown: function (event) {
		var data = this.props.data;

		if (!data) {
			return;
		}

		var delta = this.props.delta,
			lines = this.props.lines,
			pos = this.props.position,
			maxPos = data.length - 1;

		switch (event.key) {
			case 'ArrowUp':
				pos -= delta;
				if (pos < 0) {
					return;
				}
				break;

			case 'ArrowDown':
				pos += delta;
				if (pos > maxPos) {
					return;
				}
				break;

			case 'ArrowLeft':
				pos--;
				if (pos < 0) {
					return;
				}
				break;

			case 'ArrowRight':
				pos++;
				if (pos > maxPos) {
					return;
				}
				break;

			case 'PageUp':
				pos = Math.max(pos - lines * delta, pos % delta);
				break;

			case 'PageDown':
				pos += Math.min(lines, Math.floor((maxPos - pos) / delta)) * delta;
				break;

			case 'Home':
				pos = event.ctrlKey ? 0 : pos - pos % delta;
				break;

			case 'End':
				pos = event.ctrlKey ? maxPos : Math.min(maxPos, (Math.floor(pos / delta) + 1) * delta - 1);
				break;

			default:
				return;
		}

		event.preventDefault();

		this.props.setPosition(pos);
	}
});
