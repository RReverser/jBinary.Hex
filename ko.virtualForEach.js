(function () {

function eventedComputed(element, type, getValue) {
	var observable = ko.observable(),
		setValue = function () {
			observable(getValue.call(element));
		};

	ko.utils.registerEventHandler(element, type, setValue);
	setValue();

	return ko.computed(observable);
}

var windowHeight = eventedComputed(window, 'resize', function () {
	return this.document.documentElement.offsetHeight || this.innerHeight;
});

ko.bindingHandlers.virtualForEach = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var config = valueAccessor(),
			container = config.container || element,
			scrollTop = eventedComputed(container, 'scroll', function () {
				return this.scrollTop;
			}),
			offsetHeight = ko.computed(function () {
				windowHeight();
				return container.offsetHeight;
			});

		config.data = ko.computed(function () {
			console.log('update');

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

ko.expressionRewriting.bindingRewriteValidators.virtualForEach = false;
ko.virtualElements.allowedBindings.virtualForEach = true;

})();