(function () {
	var inRow = 32;

	var viewModel = {
		file: ko.observable(),
		typeSet: ko.observable(),
		binary: ko.observable(),
		current: ko.observable(0),
		items: ko.observableArray(),
		moveCurrent: function (viewModel, event) {
			var current = viewModel.current(),
				delta = 0;

			// all browsers || Chrome
			switch (event.key || event.keyIdentifier) {
				case 'Up':
					delta = -inRow;
					break;

				case 'Down':
					delta = inRow;
					break;

				case 'Left':
					delta = -1;
					break;

				case 'Right':
					delta = 1;
					break;

				case 'PageUp':
					delta = -16 * inRow;
					break;

				case 'PageDown':
					delta = 16 * inRow;
					break;

				default:
					return true;
			}

			current += delta;
			if (delta < 0) {
				if (current < 0) {
					current = 0;
				}
			} else {
				var max = viewModel.binary().view.byteLength - 1;
				if (current > max) {
					current = max;
				}
			}

			viewModel.current(current);
		},
		clickCurrent: function (viewModel, event) {
			if (event.target.classList.contains('value')) {
				viewModel.current(Number(event.target.getAttribute('data-offset')));
			} else {
				return true;
			}
		},
		toHex: function (number, length) {
			var s = number.toString(16).toUpperCase();
			while (s.length < length) {
				s = '0' + s;
			}
			return s;
		},
		splitBy: function (array, count) {
			var list = [];
			for (var i = 0, length = array.length; i < length; i += count) {
				list.push({
					offset: i,
					chunk: (array.slice || array.subarray).call(array, i, i + count)
				});
			}
			return list;
		},
		isElementInViewport: function (el) {
			var rect = el.getBoundingClientRect();

			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		}
	};

	ko.computed(function () {
		var file = viewModel.file(), typeSet = viewModel.typeSet();

		if (!file) return;

		jBinary.loadData(file, function (err, data) {
			viewModel.binary(new jBinary(data, typeSet));
			viewModel.items.removeAll();
			viewModel.getItems();
			viewModel.current(0);
		});
	});

	viewModel.current.onRender = ko.observable();

	viewModel.current.subscribe(function () {
		viewModel.current.onRender.notifySubscribers();
	});

	ko.computed(function () {
		viewModel.current.onRender();

		var oldCurrent = -1,
			newCurrent = viewModel.current(),
			oldElements = document.querySelectorAll('#binary .current'),
			newElements = document.querySelectorAll('#binary .value[data-offset="' + newCurrent + '"]');

		if (oldElements.length) {
			oldCurrent = Number(oldElements[0].getAttribute('data-offset'));
			
			ko.utils.arrayForEach(oldElements, function (oldElement) {
				oldElement.classList.remove('current');
			});
		}
		
		if (newElements.length) {
			ko.utils.arrayForEach(newElements, function (newElement) {
				newElement.classList.add('current');
			});
			if (!viewModel.isElementInViewport(newElements[0])) {
				newElements[0].scrollIntoView(newCurrent > oldCurrent);
			}
		}
	}).extend({throttle: 1});

	viewModel.getItems = function () {
		var binary = viewModel.binary(),
			items = viewModel.items,
			data = viewModel.binary().read('blob', 0);

		var nativeItems = items();
		items.valueWillMutate();
		for (var offset = 0, length = data.length; offset < length; offset += inRow) {
			nativeItems.push({
				offset: offset,
				chunk: (data.slice || data.subarray).call(data, offset, offset + inRow)
			});
		}
		items.valueHasMutated();
	}

	addEventListener('load', function () {
		ko.applyBindings(viewModel);
	});
})();