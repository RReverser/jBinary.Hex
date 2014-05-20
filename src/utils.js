/** @jsx React.DOM */

exports.toHex = (number, length) => {
	var s = number.toString(16).toUpperCase();

	while (s.length < length) {
		s = '0' + s;
	}
	
	return s;
};