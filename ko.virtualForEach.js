ko.bindingHandlers.virtualForEach = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var config = valueAccessor(),
			container = config.container || element,
			scrollTop = ko.observable(container.scrollTop),
			offsetHeight = ko.observable(container.offsetHeight);

		ko.utils.registerEventHandler(container, 'scroll', function () {
			scrollTop(container.scrollTop);
		});

		ko.utils.registerEventHandler(window, 'resize', function () {
			offsetHeight(container.offsetHeight);
		});

		config.data = ko.computed(function () {
			var items = ko.utils.unwrapObservable(config.allData),
				curScrollTop = scrollTop(),
				curOffsetHeight = offsetHeight(),
				curRowHeight = ko.utils.unwrapObservable(config.rowHeight),
				curRange = {
					first: Math.floor(curScrollTop / curRowHeight),
					last: Math.ceil((curScrollTop + curOffsetHeight) / curRowHeight)
				};

			element.style.paddingTop = curScrollTop + 'px';
			element.style.height = (items.length * curRowHeight - curScrollTop) + 'px';
			
			return items.slice(curRange.first, curRange.last);
		}).extend({throttle: 50});

		return ko.bindingHandlers.foreach.init.apply(ko.bindingHandlers.foreach, arguments);
	},
	update: ko.bindingHandlers.foreach.update
};
ko.virtualElements.allowedBindings.virtualForEach = true;