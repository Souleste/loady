(function(global, factory) {
	global.Loady = factory;
})(this, (function(element, options) {
	let Loady = this;

	this.animations = {
		snake: function (animate, svg) {
			var size = parseInt(element.getAttribute('data-size'));
			var cir = size == 'thicc' ? 250 : 283;
			return window.requestAnimationFrame(function (timestamp) {
				if (animate.start == undefined) animate.start = timestamp;
				animate.elapsed = timestamp - animate.start;

				var percent = (animate.elapsed / (animate.duration / 2)) * 100;
				var offset = (((100 - percent) / 100) * cir).toFixed(2);
				svg.setAttribute('stroke-dashoffset', offset);

				if (animate.elapsed >= animate.duration) {
					animate.elapsed = 0;
					animate.start = undefined;
					Loady.animations.snake(animate, svg);
				} else {
					Loady.animations.snake(animate, svg);
				}
			});
		}
	}
	this.colors = {
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
	}
	/* detect loady attribute change */
	this.watch = new MutationObserver(function (mutationsList, observer) {
		for (let idx in mutationsList) {
			var mutation = mutationsList[idx];
			if (mutation.type == 'attributes') {
				if (['data-animation', 'data-color', 'data-dir', 'data-size', 'data-duration'].indexOf(mutation.attributeName) <= -1 && !((mutation.attributeName == 'style' || mutation.attributeName == 'class') && (element.loadyWidth !== element.offsetWidth || element.loadyHeight !== element.offsetHeight))) return;

				if ((mutation.attributeName == 'style' || mutation.attributeName == 'class') && (element.loadyWidth !== element.offsetWidth || element.loadyHeight !== element.offsetHeight)) {
					if (element.loadyWidth !== element.offsetWidth) element.loadyWidth = element.offsetWidth;
					if (element.loadyHeight !== element.offsetHeight) element.loadyHeight = element.offsetHeight;
				};

				Loady.watch.disconnect();
				Loady.init(element);
			}
		}
	});
	this.init = function(element, options) {
		var settings = {
			size: element.getAttribute('data-size') ? element.getAttribute('data-size') : '',
			duration: element.getAttribute('data-duration') ? element.getAttribute('data-duration') : '1',
			animation: element.getAttribute('data-animation') ? element.getAttribute('data-animation') : 'spin',
			color: element.getAttribute('data-color') ? element.getAttribute('data-color') : 'black',
			phColor: element.getAttribute('data-placeholderColor') ? element.getAttribute('data-placeholderColor') : 'rgba(0,0,0,0.1)',
			direction: element.getAttribute('data-dir') ? element.getAttribute('data-dir') : ''
		};

		for (var name in options) {
			settings[name] = options[name];
		}

		element.loadyWidth = element.offsetWidth;
		element.loadyHeight = element.offsetHeight;
		var transformOrigin = (element.loadyWidth / 2).toFixed(2) + 'px';

		var html = '';
		var params = {
			origin: transformOrigin+' '+transformOrigin+' '+transformOrigin,
			strokeWidth: settings.size == 'thicc' ? 15 : settings.size == 'thin' ? 5 : 10,
			strokeColor: Loady.colors[settings.color] ? Loady.colors[settings.color] : settings.color,
			phColor: settings.phColor,
		};
		var animate = {
			duration: settings.duration * 1000,
			elapsed: 0,
			start: undefined,
		};
		var common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" stroke="'+params.strokeColor+'" stroke-width="'+params.strokeWidth+'" stroke-linecap="round" stroke-linejoin="round" ';
		switch (settings.animation) {
			case 'snake':
				params.radius = settings.size == 'thicc' ? 40 : 45;
				params.dashOffset = settings.size == 'thicc' ? 250 : 283;
				common += 'fill="none" style="transform-origin: '+params.origin+'"';
				html = '<svg class="loady-placeholder"><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-1" stroke-dasharray="'+params.dashOffset+'" stroke-dashoffset="'+params.dashOffset+'"><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg>';
				break;
			case 'spin':
				params.radius = settings.size == 'thicc' ? 40 : 45;
				common += 'fill="none" style="transform-origin: '+params.origin+'"';
				html = '<svg class="loady-placeholder"><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-1" stroke-dasharray="250" stroke-dashoffset="125"><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg>';
				break;
			case 'three-spin':
				params.rad1 = settings.size == 'thicc' ? 40 : 45;
				params.rad2 = settings.size == 'thicc' ? 25 : 30;
				params.rad3 = settings.size == 'thicc' ? 10 : 15;
				common += 'fill="none" style="transform-origin: '+params.origin+'"';
				html = '<svg class="loady-path-1" stroke-dasharray="250" stroke-dashoffset="71.5" '+common+'><circle cx="50" cy="50" r="'+params.rad1+'"></circle></svg><svg class="loady-path-2" stroke-dasharray="200" stroke-dashoffset="105" '+common+'><circle cx="50" cy="50" r="'+params.rad2+'"></circle></svg><svg class="loady-path-3" stroke-dasharray="100" stroke-dashoffset="75" '+common+'><circle cx="50" cy="50" r="'+params.rad3+'"></circle></svg>';
				break;
			case 'three-dot':
				params.radius = settings.size == 'thicc' ? 20 : settings.size == 'thin' ? 15 : 10;
				common += 'fill="'+params.strokeColor+'"';
				html = '<svg class="loady-path-1" '+common+'><circle cx="10" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-2" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-2" '+common+'><circle cx="90" cy="50" r="'+params.radius+'"></circle></svg>'
				break;
		}
		element.innerHTML = html;

		/* animate */
		if (window.navigator.userAgent.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // if IE
			switch(settings.animation) {
				case 'snake': Loady.animations.snake(animate, element.getElementsByClassName('loady-path-1')[0]); break;
			}
		}

		/* set attributes */
		element.setAttribute('data-animation', settings.animation);
		element.setAttribute('data-color', settings.color);
		element.setAttribute('data-dir', settings.dir);
		element.setAttribute('data-size', settings.size);
		element.setAttribute('data-duration', settings.duration);

		/* detect loady attribute change */
		Loady.watch.observe(element, { attributes: true }); // start observing
	}

	this.init(element, options);
	return Loady;
}));

if ('jQuery' in window && '$' in window)
	(function ($) {
		$.fn.loady = function (options) {
			return this.each(function () {
				var j = $(this);
				if (j.data('loady')) j.data('loady').watch.disconnect();

				var loady = new Loady(this, options);
				j.data('loady', loady);

				return loady;
			});
		};
	})(jQuery);

(function (elements) {
	Array.prototype.slice.call(elements).forEach(function (element) {
		new Loady(element);
	});

	/* detect new loady elements */
	const bodyObserver = new MutationObserver(function (mutationsList, observer) {
		for (let idx in mutationsList) {
			var mutation = mutationsList[idx];
			if (mutation.type == 'childList') {
				var added = Array.prototype.slice.call(mutation.addedNodes).filter(function (o) {
					if (o.nodeType !== 1) return;
					return Array.prototype.slice.call(o.classList).indexOf('loady') > -1;
				}).forEach(function (o) {
					new Loady(o);
				});
			}
		}
	});
	bodyObserver.observe(document.body, { childList: true }); // start observing
})(document.getElementsByClassName('loady'));
