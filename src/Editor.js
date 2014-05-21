/** @jsx React.DOM */

var DataTable = require('./DataTable');
var toHex = require('./utils').toHex;

module.exports = React.createClass({
	displayName: 'Editor',

	getInitialState: function () {
		return {
			data: null,
			position: 0
		};
	},

	handleItemClick: function (event) {
		this.setState({position: Number(event.target.dataset.offset)});
	},
	
	handleFile: function (event) {
		this.setState(this.getInitialState());

		jBinary.load(event.target.files[0]).then(binary => {
			this.setState({
				data: binary.read('blob'),
				position: 0
			});
		});
	},
	
	render: function () {
		var data = this.state.data,
			position = this.state.position;

		return <div className="editor" tabIndex={0} onKeyDown={this.onKeyDown}>
			<div className="toolbar">
				<input type="file" onChange={this.handleFile} />
				<div className="position" style={{display: data ? 'block' : 'none'}}>
					Position:
					0x<span>{toHex(position, 8)}</span>
					(<span>{position}</span>)
				</div>
			</div>
			<DataTable
				data={data}
				position={position}
				delta={this.props.delta}
				lines={this.props.lines}
				onItemClick={this.handleItemClick}
			/>
		</div>;
	},

	onKeyDown: function (event) {
		if (!this.state.data) {
			return;
		}

		var delta;

		switch (event.key) {
			case 'ArrowUp':
				delta = -this.props.delta;
				break;

			case 'ArrowDown':
				delta = this.props.delta;
				break;

			case 'ArrowLeft':
				delta = -1;
				break;

			case 'ArrowRight':
				delta = 1;
				break;

			case 'PageUp':
				delta = -this.props.lines * this.props.delta;
				break;

			case 'PageDown':
				delta = this.props.lines * this.props.delta;
				break;

			default:
				return;
		}

		event.preventDefault();

		var position = this.state.position;

		if ((delta > 0 && position < this.state.data.length - delta) || (delta < 0 && position >= -delta)) {
			this.setState({
				position: position += delta
			});
		}
	}
});
