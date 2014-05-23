(function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            module.exports = React.createClass({
                displayName: 'Ace',
                render: function () {
                    return React.DOM.div({ className: 'ace-editor' }, 'var jDataView = require(\'jdataview\');\n' + 'var jBinary = require(\'jbinary\');\n' + '\n' + 'module.exports = {\n' + '    \'jBinary.all\': \'File\',\n' + '\n' + '    File: {\n' + '        byte: \'uint8\',\n' + '        str: [\'string\', 10],\n' + '        other: [\'array\', \'uint8\']\n' + '    }\n' + '};');
                },
                componentDidMount: function () {
                    var editor = ace.edit(this.getDOMNode()), session = editor.getSession();
                    this.setState({
                        editor: editor,
                        session: session,
                        theme: this.props.theme,
                        mode: this.props.mode
                    });
                    this.props.sessionWasCreated(session);
                },
                componentWillUnmount: function () {
                    this.state.editor.destroy();
                },
                componentDidUpdate: function (prevProps, prevState) {
                    var state = this.state;
                    prevState = prevState || {};
                    if (prevState.theme !== state.theme) {
                        state.editor.setTheme(state.theme);
                    }
                    if (prevState.mode !== state.mode) {
                        state.session.setMode(state.mode);
                    }
                }
            });
        },
        function (module, exports) {
            var ChunkItem = _require(2);
            module.exports = React.createClass({
                displayName: 'Chunk',
                shouldComponentUpdate: function (props) {
                    var oldPos = this.props.position, newPos = props.position, start = props.offset, end = start + this.props.delta;
                    return oldPos >= start && oldPos < end || newPos >= start && newPos < end;
                },
                render: function () {
                    var items = [], formatter = this.props.formatter, formatterName = this.props.key, position = this.props.position, data = this.props.data, start = this.props.offset, end = Math.min(data.length, start + this.props.delta), onItemClick = this.props.onItemClick;
                    for (var i = start; i < end; i++) {
                        items.push(ChunkItem({
                            data: data[i],
                            key: i - start,
                            offset: i,
                            position: position,
                            formatter: formatter,
                            formatterName: formatterName,
                            onClick: onItemClick
                        }));
                    }
                    return React.DOM.td({ className: formatterName + 'group' }, items);
                }
            });
        },
        function (module, exports) {
            module.exports = function (props) {
                var offset = props.offset;
                return React.DOM.span({
                    className: 'value ' + props.formatterName + (offset === props.position ? ' current' : ''),
                    key: props.key,
                    'data-offset': offset,
                    onClick: props.onClick
                }, props.formatter(props.data));
            };
        },
        function (module, exports) {
            var Chunk = _require(1);
            var toHex = _require(7).toHex;
            var HEIGHT = 20;
            module.exports = React.createClass({
                displayName: 'DataTable',
                getInitialState: function () {
                    return { start: 0 };
                },
                onScroll: function (event) {
                    var newStart = Math.floor(event.target.scrollTop / HEIGHT);
                    if (newStart === this.state.start) {
                        return;
                    }
                    console.time('scroll');
                    this.setState({ start: newStart }, function () {
                        console.timeEnd('scroll');
                    });
                },
                componentWillReceiveProps: function (props) {
                    if (!props.data) {
                        return;
                    }
                    var delta = props.delta, line = Math.floor(props.position / delta), start = this.state.start, totalLines = Math.ceil(props.data.length / delta), end = Math.min(start + props.lines, totalLines);
                    if (line < start) {
                        this.setState({ start: line });
                    } else if (line >= end) {
                        this.setState({ start: start + (line - end) + 1 });
                    }
                },
                render: function () {
                    var rows = [], data = this.props.data, position = this.props.position, delta = this.props.delta;
                    var totalLines = 0;
                    if (data) {
                        totalLines = Math.ceil(data.length / delta);
                        for (var i = this.state.start, maxI = Math.min(this.state.start + this.props.lines, totalLines); i < maxI; i++) {
                            rows.push(React.DOM.tr({ key: i }, React.DOM.td({ className: 'offset' }, toHex(i * delta, 8)), Chunk({
                                data: data,
                                position: position,
                                offset: i * delta,
                                delta: delta,
                                formatter: function (data) {
                                    return toHex(data, 2);
                                },
                                key: 'hex',
                                onItemClick: this.props.onItemClick
                            }), Chunk({
                                data: data,
                                position: position,
                                offset: i * delta,
                                delta: delta,
                                formatter: function (data) {
                                    return data <= 32 ? ' ' : String.fromCharCode(data);
                                },
                                key: 'char',
                                onItemClick: this.props.onItemClick
                            })));
                        }
                    }
                    return React.DOM.div({
                        className: 'binary-wrapper',
                        style: { height: this.props.lines * HEIGHT },
                        scrollTop: this.state.start * HEIGHT,
                        onScroll: this.onScroll
                    }, React.DOM.table({
                        className: 'binary',
                        cols: delta
                    }, React.DOM.tbody(null, rows)), React.DOM.div({ style: { height: totalLines * HEIGHT } }));
                }
            });
        },
        function (module, exports) {
            var DataTable = _require(3);
            var Ace = _require(0);
            var Tree = _require(5);
            var toHex = _require(7).toHex;
            module.exports = React.createClass({
                displayName: 'Editor',
                getInitialState: function () {
                    return {
                        data: null,
                        position: 0
                    };
                },
                handleItemClick: function (event) {
                    this.setState({ position: Number(event.target.dataset.offset) });
                    this.getDOMNode().focus();
                },
                handleFile: function (event) {
                    this.setState(this.getInitialState());
                    jBinary.load(event.target.files[0]).then(function (binary) {
                        this.setState({
                            binary: binary,
                            data: binary.read('blob'),
                            position: 0
                        });
                        this.parse();
                    }.bind(this));
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
                    var module = { exports: {} };
                    new Function('require', 'module', 'exports', this.session.getValue())(this.innerRequire, module, module.exports);
                    this.setState({ parsed: this.state.binary.as(module.exports).readAll() });
                },
                render: function () {
                    var data = this.state.data, position = this.state.position;
                    return React.DOM.div({
                        className: 'editor',
                        tabIndex: 0,
                        onKeyDown: this.onKeyDown
                    }, React.DOM.div({ className: 'toolbar' }, React.DOM.input({
                        type: 'file',
                        onChange: this.handleFile
                    }), React.DOM.div({
                        className: 'position',
                        style: data ? {} : { display: 'none' }
                    }, 'Position:' + ' ' + '0x', React.DOM.span(null, toHex(position, 8)), '(', React.DOM.span(null, position), ')')), DataTable({
                        data: data,
                        position: position,
                        delta: this.props.delta,
                        lines: this.props.lines,
                        onItemClick: this.handleItemClick
                    }), Ace({
                        mode: 'ace/mode/javascript',
                        sessionWasCreated: this.sessionWasCreated
                    }), data ? React.DOM.div({ className: 'tree' }, React.DOM.input({
                        type: 'button',
                        onClick: this.parse,
                        value: 'Refresh'
                    }), Tree({
                        title: 'Parsed structure',
                        alwaysVisible: true,
                        split: 100,
                        object: this.state.parsed
                    })) : React.DOM.h4({ style: { textAlign: 'center' } }, 'Please load file to see parsed contents.'));
                },
                onKeyDown: function (event) {
                    var data = this.state.data;
                    if (!data) {
                        return;
                    }
                    var delta = this.props.delta, lines = this.props.lines, pos = this.state.position, maxPos = data.length - 1;
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
                    this.setState({ position: pos });
                }
            });
        },
        function (module, exports) {
            var Tree = module.exports = React.createClass({
                    displayName: 'Tree',
                    getInitialState: function () {
                        return { visible: this.props.alwaysVisible };
                    },
                    render: function () {
                        var obj = this.props.object, isObject = typeof obj === 'object' && obj !== null, split = this.props.split, keys = [], childNodes = [];
                        if (isObject) {
                            keys = this.props.keys || Object.keys(obj);
                            if (this.state.visible) {
                                var step = Math.pow(10, Math.ceil(Math.log(Math.ceil(keys.length / (split * split)) * split) / Math.LN10));
                                if (keys.length > step) {
                                    for (var i = 0, nextI, title; i < keys.length; i = nextI) {
                                        nextI = Math.min(i + step, keys.length);
                                        title = keys[i] + '..' + keys[nextI - 1];
                                        childNodes.push(React.DOM.li({ key: title }, Tree({
                                            title: title,
                                            visible: false,
                                            split: split,
                                            keys: keys.slice(i, nextI),
                                            object: obj
                                        })));
                                    }
                                } else {
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        childNodes.push(React.DOM.li({ key: key }, Tree({
                                            title: key,
                                            visible: false,
                                            split: split,
                                            object: obj[key]
                                        })));
                                    }
                                }
                            }
                        }
                        return React.DOM.div({ className: 'tree-node' }, React.DOM.h5({
                            onClick: this.toggle,
                            className: !this.props.alwaysVisible && keys.length ? 'togglable togglable-' + (this.state.visible ? 'down' : 'up') : ''
                        }, this.props.title, ': ', isObject ? obj.constructor.name : typeof obj, obj && typeof obj.length === 'number' ? '[' + (isObject ? keys : obj).length + ']' : '', !isObject ? ' = ' + JSON.stringify(obj) : ''), React.DOM.ul({ style: this.state.visible ? {} : { display: 'none' } }, childNodes));
                    },
                    toggle: function () {
                        this.setState({ visible: !this.state.visible });
                    }
                });
        },
        function (module, exports) {
            var Editor = _require(4);
            addEventListener('DOMContentLoaded', function () {
                React.renderComponent(Editor({
                    delta: 32,
                    lines: 20
                }), document.body);
            });
        },
        function (module, exports) {
            exports.toHex = function (number, length) {
                var s = number.toString(16).toUpperCase();
                while (s.length < length) {
                    s = '0' + s;
                }
                return s;
            };
        }
    ];
    _require(6);
}());