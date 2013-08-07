ko.bindingHandlers.virtualForEach = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var config = valueAccessor(),
			container = config.container || element;

		var isRangeChanged = ko.observable(true);
		config.range = ko.computed(function () {
			if (!isRangeChanged()) return;
			isRangeChanged(false);

			var rowHeight = ko.utils.unwrapObservable(config.rowHeight);

			return {
				first: Math.floor(container.scrollTop / rowHeight),
				last: Math.ceil((container.scrollTop + container.offsetHeight) / rowHeight)
			};
		});

		ko.utils.registerEventHandler(container, 'scroll', function () {
			isRangeChanged(true);
		});

		ko.utils.registerEventHandler(window, 'resize', function () {
			isRangeChanged(true);
		});

		config.data = ko.computed(function () {
			return ko.utils.unwrapObservable(config.items).slice(config.range().first, config.range().last);
		});

		return ko.bindingHandlers.foreach.init.apply(ko.bindingHandlers.foreach, arguments);
	},
	update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		return ko.bindingHandlers.foreach.update.apply(ko.bindingHandlers.foreach, arguments);
	}
};
ko.virtualElements.allowedBindings.virtualForEach = true;