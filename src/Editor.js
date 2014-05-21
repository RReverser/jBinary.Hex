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

		return <div className="editor">
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
	}
});
