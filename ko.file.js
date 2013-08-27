ko.bindingHandlers.file = {
	init: function (element, valueAccessor) {
		valueAccessor = valueAccessor();

		valueAccessor(element.files[0]);
		element.addEventListener('change', function () {
			valueAccessor(this.files[0]);
		});
	}
};