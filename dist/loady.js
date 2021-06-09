(function ($) {
	$.fn.loady = function (options) {
		var __bind = function (fn, self) {
			return function () {
				return fn.apply(self, arguments);
			};
		};

		var settings = {
			size: null,
			speed: null,
			animation: "spin",
			color: "black",
			dir: null,
			width: {
				element: null,
				container: null,
				loader: null,
			},
			height: {
				element: null,
				container: null,
				loader: null
			}
		};

		var colors = {
			primary: "34495e",
			black: "000000",
			gray: "95a5a6",
			blue: "007bff",
			"lite-blue": "71bbff",
			purple: "6f42c1",
			pink: "e83e8c",
			red: "dc3545",
			orange: "fd7e14",
			yellow: "ffc107",
			green: "28a745",
			teal: "20c997",
			cyan: "17a2b8",
			white: "ffffff"
		};

		var Loady = (function () {
			function Loady(element, o) {
				this.display = {
					element: element
				};
				this.options = o;
				construct(this);
				this.load();
			}

			var construct = function (Loady) {
				var element = Loady.display.element;
				var loader = element;
				Loady.display.loader = loader;
				if (["INPUT", "BUTTON"].indexOf(element.tagName) > -1) {
					loader = document.createElement("span");

					switch (element.tagName) {
						case "INPUT":
							var cont = document.createElement("div");
							cont.classList.add("loady-container");
							element.parentNode.insertBefore(cont, element);
							cont.appendChild(element);
							cont.appendChild(loader);
							break;
						case "BUTTON":
							element.classList.add('loady-container');
							element.appendChild(loader);
							cont = element;
							break;
					}

					if (cont !== undefined) Loady.display.container = cont;
					Loady.display.loader = loader;
				}
				
				loader.classList.add('loady');
				
				if (Loady.options.width.element) element.style.width = Loady.options.width.element + 'px';
				if (Loady.options.width.container) cont.style.width = Loady.options.width.container + 'px';
				if (Loady.options.width.loader) loader.style.width = Loady.options.width.loader + 'px';
				
				if (Loady.options.height.element) element.style.height = Loady.options.height.element + 'px';
				if (Loady.options.height.container) cont.style.height = Loady.options.height.container + 'px';
				if (Loady.options.height.loader) loader.style.height = Loady.options.height.loader + 'px';

				if (Loady.options.size)
					loader.setAttribute("data-size", Loady.options.size);
				if (Loady.options.speed)
					loader.setAttribute("data-speed", Loady.options.speed);
				if (Loady.options.animation)
					loader.setAttribute("data-animation", Loady.options.animation);
				if (Loady.options.color)
					loader.setAttribute("data-color", Loady.options.color);
				if (Loady.options.dir)
					loader.setAttribute("data-dir", Loady.options.dir);
			};

			Loady.prototype.load = function () {
				this.display.loader.classList.remove("cancel");
			};

			Loady.prototype.stop = function () {
				this.display.loader.classList.add("cancel");
			};

			return Loady;
		})();

		return this.each(function () {
			if (options) $.extend(settings, options);

			var loady = new Loady(this, settings);
			$(this).data("loady", loady);

			return loady;
		});
	};
})(jQuery);
