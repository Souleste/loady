(function ($) {
	$.fn.loady = function (options) {
		var __bind = function (fn, self) {
			return function () {
				return fn.apply(self, arguments);
			};
		};

		var settings = {
			size: null,
			speed: '1',
			animation: 'spin',
			color: 'black',
			phColor: 'rgba(0,0,0,0.1)',
			dir: null,
			placeholder: true,
			classes: {
				element: null,
				container: null,
				loader: null
			},
			create: function() { this.load(); },
			load: function() {},
			stop: function() {}
		};

		var colors = {
			primary: '#34495e',
			black: '#000000',
			gray: '#95a5a6',
			blue: '#007bff',
			'lite-blue': '#71bbff',
			purple: '#6f42c1',
			pink: '#e83e8c',
			red: '#dc3545',
			orange: '#fd7e14',
			yellow: '#ffc107',
			green: '#28a745',
			teal: '#20c997',
			cyan: '#17a2b8',
			white: '#ffffff'
		};

		var Loady = (function () {
			function Loady(element, o) {
				this.display = {
					element: element
				};
				this.options = o;
				construct(this);

				this.options.create.call(this);
			}

			var construct = function (Loady) {
				var needCont = ['AREA','BASE','BR','COL','EMBED','HR','IMG','INPUT','LINK','META','PARAM','SOURCE','TRACK','WBR'].indexOf(Loady.display.element) > -1;
				var element = Loady.display.element;

				var loader = document.createElement('span');
					loader.classList.add('loady');

				var container = element;
				if (needCont) {
					var container = document.createElement('div');
					element.parentNode.insertBefore(container, element);
				}
				Loady.display.container = container;
				container.classList.add('loady-container');
				container.appendChild(loader);

				var html = '';
				switch(Loady.options.animation) {
					case 'snake':
						var params = { strokeWidth: (Loady.options.size == 'thicc' ? 15 : Loady.options.size == 'thin' ? 5 : 10), strokeColor: Loady.options.color, phColor: Loady.options.phColor, radius: (Loady.options.size == 'thicc' ? 40 : 45) };
						html = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle class="loady-placeholder" cx="50" cy="50" r="'+params.radius+'" fill="none" stroke="'+params.phColor+'" stroke-width="'+params.strokeWidth+'"></circle><circle class="loady-path-1" cx="50" cy="50" r="'+params.radius+'" fill="none" stroke="'+params.strokeColor+'" stroke-width="'+params.strokeWidth+'" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="285" stroke-dashoffset="285" transform="rotate(-90 50 50)"></circle></svg>';
						break;
					case 'spin':
						var params = { strokeWidth: (Loady.options.size == 'thicc' ? 15 : Loady.options.size == 'thin' ? 5 : 10), strokeColor: Loady.options.color, phColor: Loady.options.phColor, radius: (Loady.options.size == 'thicc' ? 40 : 45) };
						html = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle class="loady-placeholder" cx="50" cy="50" r="'+params.radius+'" fill="none" stroke="'+params.phColor+'" stroke-width="'+params.strokeWidth+'"></circle><circle class="loady-path-1" cx="50" cy="50" r="'+params.radius+'" fill="none" stroke="'+params.strokeColor+'" stroke-width="'+params.strokeWidth+'" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="120" transform="rotate(-90 50 50)"></circle></svg>';
						break;
				}
				loader.innerHTML = html;

				Loady.display.loader = loader;

				if (Loady.options.classes.container) Loady.options.classes.container.split(',').forEach(function(o) { Loady.display.container.classList.add(o) });
				if (Loady.options.classes.element) Loady.options.classes.element.split(',').forEach(function(o) { Loady.display.element.classList.add(o) });
				if (Loady.options.classes.loader) Loady.options.classes.loader.split(',').forEach(function(o) { Loady.display.loader.classList.add(o) });

				/* set attributes */
				if (Loady.options.size)
					loader.setAttribute('data-size', Loady.options.size);
				if (Loady.options.speed)
					loader.setAttribute('data-speed', Loady.options.speed);
				if (Loady.options.animation)
					loader.setAttribute('data-animation', Loady.options.animation);
				if (Loady.options.color)
					loader.setAttribute('data-color', Loady.options.color);
				if (Loady.options.dir)
					loader.setAttribute('data-dir', Loady.options.dir);
			};

			Loady.prototype.load = function () {
				this.display.loader.classList.remove('cancel');
				this.options.load.call(this);
			};

			Loady.prototype.stop = function () {
				this.display.loader.classList.add('cancel');
				this.options.stop.call(this);
			};

			return Loady;
		})();

		return this.each(function () {
			if (options) $.extend(settings, options);

			var loady = new Loady(this, settings);
			$(this).data('loady', loady);

			return loady;
		});
	};
})(jQuery);
