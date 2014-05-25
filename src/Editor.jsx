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

	setPosition: function (position) {
		this.setState({
			position: Number(position)
		});
	},

	handlePosition: function (event) {
		this.setPosition(event.target.value);
	},

	handleFile: function (event) {
		var file = event.target.files[0];

		if (!file) {
			return;
		}

		bg('handleFile', file).then(
			data => {
				this.setState({
					data: data,
					position: 0
				});

				this.parse();
			},
			error => {
				this.setState({
					status: error.message
				});
			}
		);
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
					status: error.message,
					isParsing: false
				});
			}
		);
	},

	render: function () {
		var data = this.state.data,
			parsed = this.state.parsed,
			position = this.state.position;

		return <div className="editor">
			<form className="toolbar">
				<input type="file" onChange={this.handleFile} />
				<input type="reset" onClick={this.cleanUp} style={ifStyle(data)} />
				<div className="position" style={ifStyle(data)}>
					Position:
					0x<span>{toHex(position, 8)}</span>
					(<span>{position}</span>)
				</div>
			</form>
			<DataTable
				data={data}
				position={position}
				setPosition={this.setPosition}
				delta={this.props.delta}
				lines={this.props.lines}
				onKeyDown={this.onKeyDown} />
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
					: <h4 className="status">{this.state.status}</h4>
				}
			</div>
		</div>;
	}
});
