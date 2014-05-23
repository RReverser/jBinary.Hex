/** @jsx React.DOM */

var DataTable = require('./DataTable');
var Ace = require('./Ace');
var Tree = require('./Tree');
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
		this.getDOMNode().focus();
	},
	
	handleFile: function (event) {
		this.setState(this.getInitialState());

		jBinary.load(event.target.files[0]).then(binary => {
			this.setState({
				binary: binary,
				data: binary.read('blob'),
				position: 0
			});

			this.parse();
		});
	},

	sessionWasCreated: function (session) {
		this.session = session;
	},

	innerRequire: function (name) {
		return {
			jdataview: jDataView,
			jbinary: jBinary
		}[name];
	},

	parse: function () {
		var module = {exports: {}};

		new Function('require', 'module', 'exports', this.session.getValue())(this.innerRequire, module, module.exports);

		this.setState({
			parsed: this.state.binary.as(module.exports).readAll()
		});
	},

	render: function () {
		var data = this.state.data,
			position = this.state.position;

		return <div className="editor" tabIndex={0} onKeyDown={this.onKeyDown}>
			<div className="toolbar">
				<input type="file" onChange={this.handleFile} />
				<div className="position" style={data ? {} : {display: 'none'}}>
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
			<Ace mode="ace/mode/javascript" sessionWasCreated={this.sessionWasCreated} />
			{
				data
				? <div className="tree">
					<input type="button" onClick={this.parse} value="Refresh" />
					<Tree title="Parsed structure" visible={true} split={1000} object={this.state.parsed} />
				</div>
				: <h4 style={{textAlign: 'center'}}>Please load file to see parsed contents.</h4>
			}
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
