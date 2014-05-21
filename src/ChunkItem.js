/** @jsx React.DOM */

module.exports = function (props) {
	var offset = props.offset;

	return <span className={'value ' + props.formatterName + (offset === props.position ? ' current' : '')} data-offset={offset} onClick={props.onClick}>
		{props.formatter(props.data[offset])}
	</span>;
};
