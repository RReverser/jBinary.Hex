/** @jsx React.DOM */

var Editor = require('./Editor');

React.renderComponent(<Editor delta={32} lines={10} />, document.body);
