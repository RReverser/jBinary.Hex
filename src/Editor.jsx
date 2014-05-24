var DataTable = require('./DataTable');
var Ace = require('./Ace');
var Tree = require('./Tree');

var bg = require('./background');

var utils = require('./utils');
var toHex = utils.toHex;
var ifStyle = utils.ifStyle;

module.exports = React.createClass({
	displayName: 'Editor',

	getInitialState: function () {
		return {
			data: null,
			parsed: null,
			position: 0,
			isParsing: false,
			status: 'Please load file to see parsed contents.'
		};
	},

	handleItemClick: function (event) {
		this.setState({position: Number(event.target.dataset.offset)});
		this.getDOMNode().focus();
	},

	handleFile: function (event) {
		var file = event.target.files[0];

		if (!file) {
			return;
		}

		bg('handleFile', file).then(data => {
			this.setState({
				data: data,
				position: 0
			});
		});

		this.parse();
	},

	sessionWasCreated: function (session) {
		this.session = session;
	},

	cleanUp: function () {
		bg('cleanUp');
		this.setState(this.getInitialState());
	},

	parse: function () {
		this.setState({
			parsed: null,
			isParsing: true,
			status: 'Parsing...'
		});

		bg('parse', this.session.getValue()).then(
			parsed => {
				this.setState({
					parsed: parsed,
					isParsing: false,
					status: ''
				});
			},
			error => {
				this.setState({
					status: String(error),
					isParsing: false
				});
			}
		);
	},

	render: function () {
		var data = this.state.data,
			parsed = this.state.parsed,
			position = this.state.position;

		return <div className="editor" tabIndex={0} onKeyDown={this.onKeyDown}>
			<div className="toolbar">
				<input type="file" onChange={this.handleFile} />
				<input type="button" onClick={this.cleanUp} value="Unload file" style={ifStyle(data)} />
				<div className="position" style={ifStyle(data)}>
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
				onItemClick={this.handleItemClick} />
			<Ace mode="ace/mode/javascript" sessionWasCreated={this.sessionWasCreated} initialCode={
				"var jDataView = require('jdataview');\n" +
				"var jBinary = require('jbinary');\n" +
				"\n" +
				"module.exports = {\n" +
				"    'jBinary.all': 'File',\n" +
				"\n"+
				"    File: {\n" +
				"        byte: 'uint8',\n" +
				"        str: ['string', 10],\n" +
				"        other: ['array', 'uint8']\n" +
				"    }\n" +
				"};"
			} />
			<div className="tree">
				<input type="button" onClick={this.parse} value="Refresh" style={ifStyle(data && !this.state.isParsing)} />
				{
					parsed
					? <Tree title="Parsed structure" alwaysVisible={true} split={100} object={parsed} />
					: <h4 style={{textAlign: 'center'}}>{this.state.status}</h4>
				}
			</div>
		</div>;
	},

	onKeyDown: function (event) {
		var data = this.state.data;

		if (!data) {
			return;
		}

		var delta = this.props.delta,
			lines = this.props.lines,
			pos = this.state.position,
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

		this.setState({
			position: pos
		});
	}
});
