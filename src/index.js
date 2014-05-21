/** @jsx React.DOM */

var Editor = require('./Editor');

React.renderComponent(<Editor delta={32} lines={20} />, document.body);
