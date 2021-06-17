(function(global, factory) {
	global.Loady = factory;
})(this, (function(element, options) {
	if (element.Loady) element.Loady.watch.disconnect();

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
				}
				Loady.animations.snake(animate, svg);
			});
		},
		'three-bars': function (animate, svg) {
			return window.requestAnimationFrame(function (timestamp) {
				if (animate.start == undefined) animate.start = timestamp;
				animate.elapsed = timestamp - animate.start;

				var percent = (animate.elapsed / (animate.duration / 2)) * 100;
				var cir = Math.round(percent) >= 100 ? -70 : 70;
				var offset = (((100 - percent) / 100) * cir).toFixed(2);
				svg.setAttribute('stroke-dashoffset', offset);

				if (animate.elapsed >= animate.duration) {
					animate.elapsed = 0;
					animate.start = undefined;
				}
				Loady.animations['three-bars'](animate, svg);
			});
		},
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
				var currentWidth = parseInt(window.getComputedStyle(element)['width'].replace(/px/, '')),
				    currentHeight = parseInt(window.getComputedStyle(element)['height'].replace(/px/, ''));
				if (['data-animation', 'data-color', 'data-dir', 'data-size', 'data-duration'].indexOf(mutation.attributeName) <= -1 && !((mutation.attributeName == 'style' || mutation.attributeName == 'class') && (element.loadyWidth !== currentWidth || element.loadyHeight !== currentHeight))) return;

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

		element.loadyWidth = parseInt(window.getComputedStyle(element)['width'].replace(/px/, ''));
		element.loadyHeight = parseInt(window.getComputedStyle(element)['height'].replace(/px/, ''));
		var transformOrigin = (element.loadyWidth / 2).toFixed(2) + 'px';

		var html = '';
		var params = {
			origin: transformOrigin+' '+transformOrigin+' '+transformOrigin,
			strokeWidth: settings.size == 'thicc' ? 15 : settings.size == 'thin' ? 5 : 10,
			strokeColor: Loady.colors[settings.color] ? Loady.colors[settings.color] : settings.color,
			phColor: settings.phColor,
		};
		var common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" stroke-width="'+params.strokeWidth+'" stroke-linecap="round" stroke-linejoin="round" ';
		switch (settings.animation) {
			case 'snake':
				params.radius = settings.size == 'thicc' ? 40 : 45;
				params.dashOffset = settings.size == 'thicc' ? 250 : 283;
				common += 'fill="none" style="transform-origin: '+params.origin+'"';
				html = '<svg class="loady-placeholder" stroke="'+params.phColor+'" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-1" stroke="'+params.strokeColor+'" stroke-dasharray="'+params.dashOffset+'" stroke-dashoffset="'+params.dashOffset+'" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg>';
				break;
			case 'spin':
				params.radius = settings.size == 'thicc' ? 40 : 45;
				common += 'fill="none" style="transform-origin: '+params.origin+'"';
				html = '<svg class="loady-placeholder" stroke="'+params.phColor+'" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-1" stroke="'+params.strokeColor+'" stroke-dasharray="250" stroke-dashoffset="125" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg>';
				break;
			case 'three-spin':
				params.rad1 = settings.size == 'thicc' ? 40 : 45;
				params.rad2 = settings.size == 'thicc' ? 25 : 30;
				params.rad3 = settings.size == 'thicc' ? 10 : 15;
				common += 'fill="none" style="transform-origin: '+params.origin+'" stroke="'+params.strokeColor+'"';
				html = '<svg class="loady-path-1" stroke-dasharray="250" stroke-dashoffset="71.5" '+common+'><circle cx="50" cy="50" r="'+params.rad1+'"></circle></svg><svg class="loady-path-2" stroke-dasharray="200" stroke-dashoffset="105" '+common+'><circle cx="50" cy="50" r="'+params.rad2+'"></circle></svg><svg class="loady-path-3" stroke-dasharray="100" stroke-dashoffset="75" '+common+'><circle cx="50" cy="50" r="'+params.rad3+'"></circle></svg>';
				break;
			case 'three-dot':
				params.radius = 8;
				params.cx1 = settings.size == 'thicc' ? 15 : 13;
				params.cx3 = settings.size == 'thicc' ? 85 : 87;
				common += 'fill="'+params.strokeColor+'" stroke="'+params.strokeColor+'"';
				html = '<svg class="loady-path-1" '+common+'><circle cx="'+params.cx1+'" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-2" '+common+'><circle cx="50" cy="50" r="'+params.radius+'"></circle></svg><svg class="loady-path-3" '+common+'><circle cx="'+params.cx3+'" cy="50" r="'+params.radius+'"></circle></svg>'
				break;
			case 'three-bars':
				params.radius = 5;
				params.x1 = settings.size == 'thicc' ? 15 : settings.size == 'thin' ? 15 : 5;
				params.x2 = settings.size == 'thicc' ? 53 : settings.size == 'thin' ? 50 : 47;
				params.x3 = settings.size == 'thicc' ? 90 : settings.size == 'thin' ? 85 : 90;
				common += 'fill="none" stroke="'+params.strokeColor+'" stroke-dasharray="80" stroke-dashoffset="70"';
				html = '<svg class="loady-path-1" '+common+'><path d="m '+params.x1+' 10 l 0 80"></path></svg><svg class="loady-path-2" '+common+'><path d="m '+params.x2+' 10 l 0 80"></path></svg><svg class="loady-path-3" '+common+'><path d="m '+params.x3+' 10 l 0 80"></path></svg>';
				break;
		}
		element.innerHTML = html;

		/* animate */
		if (window.navigator.userAgent.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // if IE
			switch(settings.animation) {
				case 'snake': Loady.animations.snake({ duration: settings.duration * 1000, elapsed: 0, start: undefined }, element.getElementsByClassName('loady-path-1')[0]); break;
				case 'three-bars': 
					var third = settings.duration / 3;
					Loady.animations['three-bars']({ duration: settings.duration * 1000, elapsed: 0, start: undefined }, element.getElementsByClassName('loady-path-1')[0]); 
					setTimeout(function() {
						Loady.animations['three-bars']({ duration: settings.duration * 1000, elapsed: 0, start: undefined }, element.getElementsByClassName('loady-path-2')[0]); 
					}, third.toFixed(2) );
					setTimeout(function() {
						Loady.animations['three-bars']({ duration: settings.duration * 1000, elapsed: 0, start: undefined }, element.getElementsByClassName('loady-path-3')[0]); 
					}, (third * 2).toFixed(2) );
				break;
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
	element.Loady = Loady;
	return Loady;
}));

if ('jQuery' in window && '$' in window) {
	(function($) {
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
}

(function (elements) {
	Array.prototype.slice.call(elements).forEach(function (element) {
		new Loady(element);
	});

	/* detect new loady elements */
	const bodyObserver = new MutationObserver(function (mutationsList, observer) {
		for (let idx in mutationsList) {
			var mutation = mutationsList[idx];
			if (mutation.type == 'childList' || mutation.type == 'subtree') {
				var added = Array.prototype.slice.call(mutation.addedNodes).filter(function (o) {
					if (o.nodeType !== 1) return;
					return Array.prototype.slice.call(o.classList).indexOf('loady') > -1;
				}).forEach(function (o) {
					console.log('MUTATION');
					new Loady(o);
				});
			}
		}
	});
	bodyObserver.observe(document, { childList: true, subtree: true }); // start observing
})(document.getElementsByClassName('loady'));
