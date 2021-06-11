(function (elements) {
	var colors = {
		primary: "#34495e",
		black: "#000000",
		gray: "#95a5a6",
		blue: "#007bff",
		"lite-blue": "#71bbff",
		purple: "#6f42c1",
		pink: "#e83e8c",
		red: "#dc3545",
		orange: "#fd7e14",
		yellow: "#ffc107",
		green: "#28a745",
		teal: "#20c997",
		cyan: "#17a2b8",
		white: "#ffffff"
	};

	var Loady = function (element) {
		var settings = {
			size: element.getAttribute("data-size") ?? "",
			speed: element.getAttribute("data-speed") ?? "1",
			animation: element.getAttribute("data-animation") ?? "spin",
			color: element.getAttribute("data-color") ?? "black",
			phColor: element.getAttribute("data-placeholderColor") ?? "rgba(0,0,0,0.1)",
			direction: element.getAttribute("data-dir") ?? ""
		};

		var html = "";
		var params = {
			strokeWidth:
				settings.size == "thicc" ? 15 : settings.size == "thin" ? 5 : 10,
			strokeColor: colors[settings.color] ?? settings.color,
			phColor: settings.phColor,
			radius: settings.size == "thicc" ? 40 : 45
		};
		switch (settings.animation) {
			case "snake":
				html =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle class="loady-placeholder" cx="50" cy="50" r="' +
					params.radius +
					'" fill="none" stroke="' +
					params.phColor +
					'" stroke-width="' +
					params.strokeWidth +
					'"></circle><circle class="loady-path-1" cx="50" cy="50" r="' +
					params.radius +
					'" fill="none" stroke="' +
					params.strokeColor +
					'" stroke-width="' +
					params.strokeWidth +
					'" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="285" stroke-dashoffset="285" transform="rotate(-90 50 50)"></circle></svg>';
				break;
			case "spin":
				html =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><circle class="loady-placeholder" cx="50" cy="50" r="' +
					params.radius +
					'" fill="none" stroke="' +
					params.phColor +
					'" stroke-width="' +
					params.strokeWidth +
					'"></circle><circle class="loady-path-1" cx="50" cy="50" r="' +
					params.radius +
					'" fill="none" stroke="' +
					params.strokeColor +
					'" stroke-width="' +
					params.strokeWidth +
					'" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="120" transform="rotate(-90 50 50)"></circle></svg>';
				break;
		}
		element.innerHTML = html;

		/* set attributes */
		element.setAttribute("data-animation", settings.animation);
		element.setAttribute("data-color", settings.color);
		element.setAttribute("data-dir", settings.dir);
		element.setAttribute("data-size", settings.size);
		element.setAttribute("data-speed", settings.speed);

		/* detect loady attribute change */
		const loadyObserver = new MutationObserver(function (
			mutationsList,
			observer
		) {
			for (const mutation of mutationsList) {
				if (mutation.type == "attributes") {
					if (
						[
							"data-animation",
							"data-color",
							"data-dir",
							"data-size",
							"data-speed"
						].indexOf(mutation.attributeName) > -1
					) {
						loadyObserver.disconnect();
						Loady(element);
					}
				}
			}
		});
		loadyObserver.observe(element, { attributes: true }); // start observing
	};

	Array.prototype.slice.call(elements).forEach(function (element) {
		Loady(element);
	});

	/* detect new .loady elements */
	const bodyObserver = new MutationObserver(function (mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type == "childList") {
				var added = Array.prototype.slice
					.call(mutation.addedNodes)
					.filter(function (o) {
						if (o.nodeName == "#text") return;
						return o.classList.contains("loady");
					})
					.forEach(function (o) {
						Loady(o);
					});
			}
		}
	});
	bodyObserver.observe(document.body, { childList: true }); // start observing
})(document.getElementsByClassName("loady"));
