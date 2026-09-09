/*!
 * docsify-charty 4.0.0 | (c) Mark Battistella | MIT
 *
 * This is the browser half of Charty. The Publish plugin at
 * github.com/markbattistella/publish-plugin-charty renders the same markup
 * from Swift and ships the same stylesheet, so a chart written once looks the
 * same on either site generator. Keep the two in step: the sections below
 * mirror the Swift module file for file.
 */

(function () {
	'use strict';

	//
	// MARK: - markup
	//

	// Escapes text before it reaches the page. Every label, title, and caption
	// goes through here; the previous version wrote them straight into
	// innerHTML, which made any chart definition an injection vector.
	function escapeText(value, isAttribute) {
		var output = '';

		String(value === undefined || value === null ? '' : value)
			.split('')
			.forEach(function (character) {
				if (character === '&') { output += '&amp;'; }
				else if (character === '<') { output += '&lt;'; }
				else if (character === '>') { output += '&gt;'; }
				else if (character === '"' && isAttribute) { output += '&quot;'; }
				else if (character === "'" && isAttribute) { output += '&#39;'; }
				else { output += character; }
			});

		return output;
	}

	// Builds an element. Attributes are an ordered array of [name, value] pairs
	// so the output matches the Swift port byte for byte.
	var VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
		'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

	function element(tag, attributes, children) {
		var markup = '<' + tag;

		(attributes || []).forEach(function (attribute) {
			if (attribute === null || attribute === undefined) { return; }
			markup += ' ' + attribute[0] + '="' + escapeText(attribute[1], true) + '"';
		});

		var body = (children || []).filter(function (child) {
			return child !== null && child !== undefined && child !== '';
		}).join('');

		if (!body && VOID_ELEMENTS.indexOf(tag) !== -1) {
			return markup + '>';
		}

		return markup + '>' + body + '</' + tag + '>';
	}

	// Rounds half away from zero, the way Swift's rounded() does, so both
	// ports land on the same string for a value that sits exactly on a
	// boundary. Math.round rounds -0.5 up to -0, which would differ.
	function roundHalf(value) {
		return value < 0 ? -Math.round(-value) : Math.round(value);
	}

	// Rounds a coordinate to three decimals and strips trailing zeros.
	function svgValue(value) {
		if (!isFinite(value)) { return '0'; }

		var rounded = roundHalf(value * 1000) / 1000;

		if (rounded === roundHalf(rounded) && Math.abs(rounded) < 1e15) {
			return String(roundHalf(rounded));
		}

		return rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
	}

	// Formats a value for a reader, with thousands separators.
	function displayValue(value) {
		return Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
	}

	// Formats a fraction as a percentage.
	function percentageValue(fraction, decimals) {
		var places = Math.pow(10, decimals === undefined ? 2 : decimals);
		return svgValue(roundHalf(fraction * 100 * places) / places) + '%';
	}

	// An SVG label, with its alignment written as presentation attributes.
	// A blanket text-anchor rule in the stylesheet would override these, so the
	// stylesheet deliberately sets neither.
	function label(text, x, y, anchor, baseline, extra) {
		var attributes = [
			['x', svgValue(x)],
			['y', svgValue(y)],
			['text-anchor', anchor || 'middle'],
			['dominant-baseline', baseline || 'middle']
		];

		return element('text', attributes.concat(extra || []), [escapeText(text, false)]);
	}

	//
	// MARK: - colour
	//

	// The theme colour is converted to OKLCH and stepped through a clamped
	// lightness range. The old ramp multiplied HSL lightness by the series
	// index across 0-98%, so the first series was always black, the last was
	// always near-white, and the steps between were perceptually uneven.
	var DEFAULT_THEME = { lightness: 0.623, chroma: 0.164, hue: 251.5 };

	function colourFromHex(hex) {
		if (!hex) { return null; }

		var digits = String(hex).trim().replace(/^#/, '');

		if (digits.length === 3) {
			digits = digits.split('').map(function (d) { return d + d; }).join('');
		}

		if (!/^[0-9a-f]{6}$/i.test(digits)) { return null; }

		function channel(offset) {
			return parseInt(digits.substr(offset, 2), 16) / 255;
		}

		return colourFromRGB(channel(0), channel(2), channel(4));
	}

	function colourFromRGB(red, green, blue) {
		function linear(channel) {
			return channel <= 0.04045
				? channel / 12.92
				: Math.pow((channel + 0.055) / 1.055, 2.4);
		}

		var r = linear(red), g = linear(green), b = linear(blue);

		var long = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
			medium = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
			short = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

		var l = Math.cbrt(long), m = Math.cbrt(medium), s = Math.cbrt(short);

		var lightness = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
			a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
			bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

		var hue = Math.atan2(bAxis, a) * 180 / Math.PI;
		if (hue < 0) { hue += 360; }

		return {
			lightness: lightness,
			chroma: Math.sqrt(a * a + bAxis * bAxis),
			hue: hue
		};
	}

	var LIGHT_BOUNDS = { start: 0.44, end: 0.80 },
		DARK_BOUNDS = { start: 0.54, end: 0.87 },
		DARK_INK = 'oklch(0.2 0 0)',
		LIGHT_INK = 'oklch(0.99 0 0)';

	function rampStep(theme, position, isDark) {
		var bounds = isDark ? DARK_BOUNDS : LIGHT_BOUNDS;

		// Chroma tapers towards both ends; very light and very dark colours
		// cannot hold full chroma without clipping outside sRGB.
		var taper = 1 - 0.28 * Math.abs(2 * position - 1);

		// A small hue rotation gives adjacent series a second cue beyond
		// lightness alone.
		var hue = (theme.hue + 16 * (position - 0.5)) % 360;
		if (hue < 0) { hue += 360; }

		return {
			lightness: bounds.start + (bounds.end - bounds.start) * position,
			chroma: theme.chroma * taper,
			hue: hue
		};
	}

	function cssColour(colour) {
		return 'oklch(' + svgValue(colour.lightness) + ' ' +
			svgValue(colour.chroma) + ' ' + svgValue(colour.hue) + ')';
	}

	// light-dark() lets the browser resolve the right branch from color-scheme,
	// which is what removed the need to toggle a .dark class from script.
	function seriesColour(light, dark) {
		var lightValue = cssColour(light), darkValue = cssColour(dark);

		return {
			css: lightValue === darkValue
				? lightValue
				: 'light-dark(' + lightValue + ', ' + darkValue + ')',
			ink: light.lightness > 0.62 ? DARK_INK : LIGHT_INK
		};
	}

	function palette(theme, count) {
		if (count <= 0) { return []; }

		if (count === 1) {
			return [seriesColour(rampStep(theme, 0.5, false), rampStep(theme, 0.5, true))];
		}

		var entries = [];
		for (var index = 0; index < count; index++) {
			var position = index / (count - 1);
			entries.push(seriesColour(
				rampStep(theme, position, false),
				rampStep(theme, position, true)
			));
		}
		return entries;
	}

	//
	// MARK: - model
	//

	var ALIASES = {
		doughnut: 'donut',
		sectional: 'section',
		rings: 'ring',
		scatter: 'plot',
		review: 'rating'
	};

	var TYPES = ['radar', 'area', 'pie', 'donut', 'section', 'ring', 'plot',
		'line', 'bubble', 'bar', 'column', 'bar-stack', 'column-stack', 'rating'];

	function resolveType(raw) {
		if (!raw) { return null; }

		var normalised = String(raw).trim().toLowerCase();

		if (ALIASES[normalised]) { return ALIASES[normalised]; }

		if (/-stacked$/.test(normalised)) {
			normalised = normalised.replace(/-stacked$/, '-stack');
		}

		return TYPES.indexOf(normalised) === -1 ? null : normalised;
	}

	var AXES_TYPES = ['area', 'plot', 'line', 'bubble', 'bar', 'column',
		'bar-stack', 'column-stack'];

	// Reads the raw JSON into the shape the renderers expect. Values become
	// arrays either way, and both spellings of colour are accepted.
	function normaliseSeries(raw) {
		var values = Array.isArray(raw.value)
			? raw.value.map(Number)
			: (typeof raw.value === 'number' ? [raw.value] : []);

		return {
			label: raw.label === undefined || raw.label === null ? '' : String(raw.label),
			values: values,
			isScalar: typeof raw.value === 'number',
			colour: raw.colour || raw.color || null,
			points: Array.isArray(raw.points) ? raw.points.map(String) : null
		};
	}

	function normaliseOptions(raw) {
		var options = raw || {};

		// The README has always documented these as defaulting to true. The
		// old code defaulted them to false whenever a key was absent, because
		// undefined is falsy.
		function flag(value) { return value === undefined ? true : value === true; }

		return {
			theme: options.theme || null,
			legend: flag(options.legend),
			labels: flag(options.labels),
			numbers: flag(options.numbers)
		};
	}

	// Charts whose series each hold one number are summarised as a single row,
	// so that "sum" means the total of every slice.
	function statistics(series) {
		var isScalar = series.length > 0 && series[0].isScalar;

		var grid = isScalar
			? [series.reduce(function (all, item) { return all.concat(item.values); }, [])]
			: series.map(function (item) { return item.values; });

		var rows = grid.map(function (values) {
			if (!values.length) { return { minimum: 0, maximum: 0, sum: 0, average: 0 }; }

			var sum = values.reduce(function (a, b) { return a + b; }, 0);

			return {
				minimum: Math.min.apply(Math, values),
				maximum: Math.max.apply(Math, values),
				sum: sum,
				average: sum / values.length
			};
		});

		var largest = rows.reduce(function (highest, row) {
			return Math.max(highest, row.maximum);
		}, 0);

		return {
			rows: rows,
			largest: largest,
			isScalarData: isScalar,
			// Guards the divide-by-zero that wrote NaN into the SVG whenever
			// every value in a chart was zero.
			scale: largest > 0 ? largest : 1,
			total: rows.reduce(function (sum, row) { return sum + row.sum; }, 0),
			row: function (index) {
				return rows[index] || rows[0] || { minimum: 0, maximum: 0, sum: 0, average: 0 };
			}
		};
	}

	// A short identifier derived from the chart's contents. Identifiers inside
	// the SVG must be unique per page; they used to be hard-coded, so a second
	// chart referenced the first chart's filter.
	function identifierFor(body) {
		var hash = 0x811c9dc5;

		for (var index = 0; index < body.length; index++) {
			hash = (hash ^ body.charCodeAt(index)) >>> 0;
			// Math.imul, not *, because 32-bit values multiplied by the FNV
			// prime overflow the 53 bits a JavaScript number can hold exactly,
			// which would drift away from the Swift port's identifiers.
			hash = Math.imul(hash, 0x01000193) >>> 0;
		}

		return 'charty-' + hash.toString(36);
	}

	//
	// MARK: - axis
	//

	// The most ticks an axis will carry, counting zero, and the step sizes it
	// is allowed to use before scaling by a power of ten. These are intervals
	// people actually read, rather than whatever falls out of dividing the
	// largest value evenly: the old axis was labelled 22, 43, 65, 87.
	var MAX_TICKS = 8,
		STEPS = [1, 2, 2.5, 5];

	function niceScale(maximum) {
		if (!isFinite(maximum) || maximum <= 0) {
			return { maximum: 1, step: 1, tickCount: 2 };
		}

		var exponent = Math.floor(Math.log(maximum) / Math.LN10) - 2;

		for (var power = exponent; power <= exponent + 4; power++) {
			var magnitude = Math.pow(10, power);

			for (var i = 0; i < STEPS.length; i++) {
				var step = STEPS[i] * magnitude;
				if (!(step > 0)) { continue; }

				var ticks = Math.ceil(maximum / step) + 1;
				if (ticks <= MAX_TICKS) {
					return scaleOf(Math.ceil(maximum / step) * step, step);
				}
			}
		}

		return scaleOf(maximum, maximum);
	}

	function scaleOf(maximum, step) {
		return {
			maximum: maximum,
			step: step,
			tickCount: step > 0 ? Math.round(maximum / step) + 1 : 2
		};
	}

	// The two solid lines the data is measured against, drawn at the edges of
	// the data area rather than as borders on the container.
	function axisLines() {
		return element('g', [['class', 'charty__axis-lines']], [
			element('line', [['x1', '0'], ['y1', '0'], ['x2', '0'], ['y2', '100']]),
			element('line', [['x1', '0'], ['y1', '100'], ['x2', '100'], ['y2', '100']])
		]);
	}

	function grid(scale, orientation, showsLabels, isPercentage) {
		var lines = [], labels = [];

		for (var tick = 0; tick < scale.tickCount; tick++) {
			var value = tick * scale.step,
				position = scale.maximum > 0 ? value / scale.maximum * 100 : 0,
				text = isPercentage ? svgValue(value) + '%' : displayValue(value);

			if (orientation === 'vertical') {
				var y = 100 - position;
				lines.push(element('line', [
					['x1', '0'], ['x2', '100'],
					['y1', svgValue(y)], ['y2', svgValue(y)]
				]));
				labels.push(label(text, -3, y, 'end'));
			} else {
				lines.push(element('line', [
					['x1', svgValue(position)], ['x2', svgValue(position)],
					['y1', '0'], ['y2', '100']
				]));
				labels.push(label(text, position, 104, 'middle', 'hanging'));
			}
		}

		var children = [
			element('g', [['class', 'charty__grid-lines']], lines),
			axisLines()
		];

		if (showsLabels) {
			children.push(element('g', [['class', 'charty__grid-labels']], labels));
		}

		return element('g', [['class', 'charty__grid'], ['aria-hidden', 'true']], children);
	}

	// Data is drawn inside the unit square, but tick numbers and category names
	// sit just outside it. Extending the box to cover those gutters keeps them
	// part of the drawing so they scale with the chart.
	function viewBoxFor(orientation) {
		return orientation === 'vertical' ? '-16 -7 120 118' : '-22 -5 136 116';
	}

	//
	// MARK: - renderers
	//

	function seriesGroup(context, index, children) {
		return element('g', [
			['class', 'charty__series'],
			['data-series', String(index)],
			colourStyle(context, index)
		], children);
	}

	function colourStyle(context, index) {
		var colour = context.colours[index] || { css: 'currentColor', ink: DARK_INK };
		return ['style', '--charty-series: ' + colour.css + '; --charty-ink: ' + colour.ink];
	}

	function backdrop(context) {
		return [['filter', 'url(#' + context.identifier + '-backdrop)']];
	}

	// -- pie / donut / section

	function circlePoint(fraction) {
		var angle = 2 * Math.PI * fraction - Math.PI / 2;
		return [50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)];
	}

	function renderCircle(context) {
		var chart = blankChart(),
			isSection = context.type === 'section',
			total = context.statistics.total,
			cumulative = 0;

		context.series.forEach(function (series, index) {
			var value = series.values[0] || 0,
				fraction = isSection ? value : (total > 0 ? value / total : 0);

			chart.legendValues.push(context.options.numbers
				? (isSection
					? percentageValue(fraction)
					: displayValue(value) + ' · ' + percentageValue(fraction, 1))
				: null);

			if (!(fraction > 0)) { return; }

			var shape;

			// A slice covering the whole circle starts and ends at the same
			// point, which makes an arc command draw nothing at all. Any chart
			// with a single data point used to render as an empty box.
			if (fraction >= 1) {
				shape = element('circle', [
					['cx', '50'], ['cy', '50'], ['r', '50'],
					['fill', 'var(--charty-series)']
				]);
			} else {
				var begin = circlePoint(cumulative),
					end = circlePoint(cumulative + fraction),
					largeArc = fraction > 0.5 ? '1' : '0';

				shape = element('path', [
					['d', 'M 50 50 L ' + svgValue(begin[0]) + ' ' + svgValue(begin[1]) +
						' A 50 50 0 ' + largeArc + ' 1 ' + svgValue(end[0]) + ' ' +
						svgValue(end[1]) + ' Z'],
					['fill', 'var(--charty-series)']
				]);
			}

			cumulative += fraction;
			chart.canvas.push(seriesGroup(context, index, [shape]));
		});

		if (context.type === 'donut') {
			chart.defs.push(element('mask', [['id', context.identifier + '-hole']], [
				element('rect', [['width', '100'], ['height', '100'], ['fill', 'white']]),
				element('circle', [['cx', '50'], ['cy', '50'], ['r', '25'], ['fill', 'black']])
			]));
			chart.groupAttributes.push(['mask', 'url(#' + context.identifier + '-hole)']);
		}

		return chart;
	}

	// -- ring

	function renderRing(context) {
		var chart = blankChart(),
			count = Math.max(context.series.length, 1),
			bandWidth = 32 / count,
			usesFractions = (context.statistics.rows[0] || {}).maximum <= 1;

		context.series.forEach(function (series, index) {
			var raw = series.values[0] || 0,
				fraction = Math.min(Math.max(usesFractions ? raw : raw / 100, 0), 1),
				radius = 50 - (3 * index + 1) * bandWidth / 2,
				circumference = 2 * Math.PI * radius;

			var shared = [
				['cx', '50'], ['cy', '50'],
				['r', svgValue(radius)],
				['stroke-width', svgValue(bandWidth)],
				['fill', 'none']
			];

			chart.canvas.push(element('g', [
				['class', 'charty__series'],
				['data-series', String(index)],
				// Rings begin at the top. Rotating here rather than in the
				// stylesheet keeps the drawing correct on its own.
				['transform', 'rotate(-90 50 50)'],
				colourStyle(context, index)
			], [
				element('circle', [['class', 'charty__ring-track']].concat(shared)),
				element('circle', [
					['class', 'charty__ring-fill'],
					['stroke', 'var(--charty-series)'],
					['stroke-linecap', 'round'],
					['stroke-dasharray', svgValue(circumference) + ' ' + svgValue(circumference)],
					['stroke-dashoffset', svgValue(circumference - fraction * circumference)]
				].concat(shared))
			]));

			// The old code multiplied a toFixed string by 100, floating values
			// such as 76 out to 76.00000000000001.
			chart.legendValues.push(context.options.numbers ? percentageValue(fraction, 1) : null);
		});

		return chart;
	}

	// -- radar

	var RADAR_RADIUS = 100, RADAR_LABEL_RADIUS = 116;

	function radarAngle(position, count) {
		return (2 * Math.PI / count) * position - Math.PI / 2;
	}

	function radarAnchor(cosine) {
		if (cosine > 0.2) { return 'start'; }
		if (cosine < -0.2) { return 'end'; }
		return 'middle';
	}

	function renderRadar(context) {
		var chart = blankChart();
		chart.viewBox = '-132 -132 264 264';

		var points = context.points;

		if (!points.length) {
			context.warn('the chart declares no points to draw axes for');
			return chart;
		}

		var rings = [], spokes = [], axisLabels = [];

		for (var radius = 20; radius <= RADAR_RADIUS; radius += 20) {
			rings.push(element('circle', [['cx', '0'], ['cy', '0'], ['r', svgValue(radius)]]));
		}

		points.forEach(function (name, position) {
			var angle = radarAngle(position, points.length);

			spokes.push(element('line', [
				['x1', '0'], ['y1', '0'],
				['x2', svgValue(RADAR_RADIUS * Math.cos(angle))],
				['y2', svgValue(RADAR_RADIUS * Math.sin(angle))]
			]));

			// Labels are placed by coordinate rather than rotated into
			// position, so they stay upright instead of running upside-down on
			// the left half of the chart.
			axisLabels.push(label(
				name,
				RADAR_LABEL_RADIUS * Math.cos(angle),
				RADAR_LABEL_RADIUS * Math.sin(angle),
				radarAnchor(Math.cos(angle))
			));
		});

		chart.canvas.push(element('g', [
			['class', 'charty__grid'], ['aria-hidden', 'true']
		], [
			element('g', [['class', 'charty__grid-rings']], rings),
			element('g', [['class', 'charty__grid-lines']], spokes),
			context.options.labels
				? element('g', [['class', 'charty__grid-labels']], axisLabels)
				: ''
		]));

		context.series.forEach(function (series, index) {
			chart.legendValues.push(null);

			if (series.values.length !== points.length) {
				context.warn('"' + series.label + '" has ' + series.values.length +
					' values but the chart declares ' + points.length + ' points');
				return;
			}

			var vertices = [], valueLabels = [],
				// Labels are fanned along the spoke, one step per series, so
				// overlapping shapes do not stack their numbers in one place.
				nudge = 9 * (index - (context.series.length - 1) / 2);

			series.values.forEach(function (value, position) {
				if (value < 0 || value > 100) {
					context.warn('"' + series.label + '" has a value of ' + value +
						'; radar values must be between 0 and 100');
					return;
				}

				var angle = radarAngle(position, points.length),
					distance = RADAR_RADIUS * value / 100,
					labelDistance = Math.min(Math.max(distance + nudge, 12), 104);

				vertices.push(svgValue(distance * Math.cos(angle)) + ',' +
					svgValue(distance * Math.sin(angle)));

				valueLabels.push(label(
					svgValue(value) + '%',
					labelDistance * Math.cos(angle),
					labelDistance * Math.sin(angle),
					'middle', 'middle', backdrop(context)
				));
			});

			chart.canvas.push(seriesGroup(context, index, [
				element('polygon', [
					['points', vertices.join(' ')],
					['fill', 'var(--charty-series)']
				]),
				context.options.numbers
					? element('g', [['class', 'charty__values']], valueLabels)
					: ''
			]));
		});

		return chart;
	}

	// -- area

	function renderArea(context) {
		var chart = blankChart();
		chart.axes = { horizontal: null, vertical: 'Values' };
		chart.viewBox = viewBoxFor('vertical');

		// Values are drawn against the rounded-up axis, so the top of the
		// tallest shape lines up with a tick rather than the canvas edge.
		var scale = niceScale(context.statistics.largest);
		chart.canvas.push(grid(scale, 'vertical', context.options.labels, false));

		context.series.forEach(function (series, index) {
			chart.legendValues.push(null);

			// A single point has no span to spread across the canvas, and
			// dividing by that span is where the old code produced NaN.
			if (series.values.length < 2) { return; }

			var step = 100 / (series.values.length - 1),
				side = index - (context.series.length - 1) / 2,
				vertices = [], valueLabels = [];

			series.values.forEach(function (value, position) {
				var x = step * position,
					y = 100 - (value / scale.maximum * 100);

				vertices.push(svgValue(x) + ',' + svgValue(y));
				valueLabels.push(label(displayValue(value), x, y + 2 * side * 4.5,
					'middle', 'middle', backdrop(context)));
			});

			// Close the shape along the baseline so it fills.
			vertices.push('100,100', '0,100');

			chart.canvas.push(seriesGroup(context, index, [
				element('polygon', [
					['points', vertices.join(' ')],
					['fill', 'var(--charty-series)']
				]),
				context.options.numbers
					? element('g', [['class', 'charty__values']], valueLabels)
					: ''
			]));
		});

		return chart;
	}

	// -- plot / line / bubble

	var POINT_RADIUS = 1.6;

	function renderPlot(context) {
		var chart = blankChart();
		chart.axes = { horizontal: null, vertical: 'Values' };
		chart.viewBox = viewBoxFor('vertical');

		// Values are drawn against the rounded-up axis, so the top of the
		// tallest shape lines up with a tick rather than the canvas edge.
		var scale = niceScale(context.statistics.largest);
		chart.canvas.push(grid(scale, 'vertical', context.options.labels, false));

		context.series.forEach(function (series, index) {
			chart.legendValues.push(null);
			if (!series.values.length) { return; }

			var slot = 100 / series.values.length,
				rowSum = context.statistics.row(index).sum,
				// Labels are fanned around the point, one step per series, so
				// lines running close together do not stack their numbers.
				side = index - (context.series.length - 1) / 2,
				vertices = [], points = [], valueLabels = [];

			series.values.forEach(function (value, position) {
				var x = slot * (position + 0.5),
					y = 100 - (value / scale.maximum * 100),
					radius = context.type === 'bubble' && rowSum > 0
						? POINT_RADIUS + 5 * value / rowSum
						: POINT_RADIUS;

				vertices.push(svgValue(x) + ',' + svgValue(y));

				points.push(element('circle', [
					['cx', svgValue(x)], ['cy', svgValue(y)],
					['r', svgValue(radius)],
					['fill', 'var(--charty-series)']
				]));

				valueLabels.push(label(displayValue(value), x, y + 2 * side * (radius + 3.5),
					'middle', 'middle', backdrop(context)));
			});

			var children = [];

			// The connecting line is drawn first so the points sit on top of it.
			if (context.type === 'line') {
				children.push(element('polyline', [
					['class', 'charty__line'],
					['points', vertices.join(' ')],
					['stroke', 'var(--charty-series)'],
					['stroke-width', '0.8'],
					['stroke-linecap', 'round'],
					['stroke-linejoin', 'round'],
					['fill', 'none']
				]));
			}

			children = children.concat(points);

			if (context.options.numbers) {
				children.push(element('g', [['class', 'charty__values']], valueLabels));
			}

			chart.canvas.push(seriesGroup(context, index, children));
		});

		return chart;
	}

	// -- bar / column

	// The share of a group's width left empty, split between its two sides, and
	// the share of a bar's slot left empty when a group holds several bars.
	// Bars within a group sit close together and groups sit far apart, so the
	// grouping reads at a glance; the old spacing was uniform, which made a
	// grouped chart look like one long run of bars.
	var GROUP_PADDING = 0.24,
		BAR_PADDING = 0.12;

	// Works out where each bar sits along the category axis.
	function barGeometry(groupCount, barsPerGroup) {
		var groupWidth = 100 / Math.max(groupCount, 1),
			inset = groupWidth * GROUP_PADDING / 2,
			slotWidth = groupWidth * (1 - GROUP_PADDING) / Math.max(barsPerGroup, 1),
			barWidth = barsPerGroup > 1 ? slotWidth * (1 - BAR_PADDING) : slotWidth;

		return function (group, index) {
			var slot = groupWidth * group + inset + slotWidth * index,
				start = slot + (slotWidth - barWidth) / 2;
			return { start: start, width: barWidth, centre: start + barWidth / 2 };
		};
	}

	function renderBar(context) {
		var chart = blankChart(),
			isColumn = context.type === 'column' || context.type === 'column-stack',
			isStacked = /-stack$/.test(context.type),
			orientation = isColumn ? 'horizontal' : 'vertical',
			series = context.series,
			valueCount = series.reduce(function (most, item) {
				return Math.max(most, item.values.length);
			}, 0);

		chart.viewBox = viewBoxFor(orientation);

		if (!valueCount) {
			context.warn('the chart has no data to draw');
			return chart;
		}

		series.forEach(function (item) {
			if (item.values.length !== valueCount) {
				context.warn('the chart has ' + series.length + ' series but ' +
					item.values.length + ' values in "' + item.label + '"; these must match');
			}
		});

		// With one value per series, each series is its own category and gets
		// its own slot along the axis. With several, the slots are the value
		// positions and the series are grouped inside them.
		var isSimple = valueCount === 1 && !isStacked,
			groupCount = isSimple ? series.length : valueCount,
			barsPerGroup = (isSimple || isStacked) ? 1 : series.length,
			scale = isStacked
				? scaleOf(100, 20)
				: niceScale(context.statistics.largest);

		// Stacked charts are measured as a share of each column, so the axis is
		// named for what it shows. Grouped charts name their bars in the legend
		// rather than along the axis, so there is no category axis to title.
		var valueTitle = isStacked ? 'Share' : 'Values',
			categoryTitle = isSimple ? 'Labels' : null;

		chart.axes = orientation === 'vertical'
			? { horizontal: categoryTitle, vertical: valueTitle }
			: { horizontal: valueTitle, vertical: categoryTitle };

		chart.canvas.push(grid(scale, orientation, context.options.labels, isStacked));

		var geometry = barGeometry(groupCount, barsPerGroup),
			columnTotals = [], offsets = [], categoryLabels = [];

		for (var position = 0; position < valueCount; position++) {
			columnTotals.push(series.reduce(function (sum, item) {
				return sum + (item.values[position] || 0);
			}, 0));
			offsets.push(0);
		}

		series.forEach(function (item, index) {
			var shapes = [], valueLabels = [];

			item.values.forEach(function (value, position) {
				var group = isSimple ? index : position,
					slotIndex = (isSimple || isStacked) ? 0 : index,
					extent = isStacked
						? (columnTotals[position] > 0 ? value / columnTotals[position] * 100 : 0)
						: (scale.maximum > 0 ? value / scale.maximum * 100 : 0),
					start = isStacked ? offsets[position] : 0;

				if (isStacked) { offsets[position] += extent; }

				var bar = geometry(group, slotIndex), attributes;

				if (orientation === 'vertical') {
					attributes = [
						['x', svgValue(bar.start)],
						['y', svgValue(isStacked ? start : 100 - extent)],
						['width', svgValue(bar.width)],
						['height', svgValue(Math.max(extent, 0))]
					];
				} else {
					attributes = [
						['x', svgValue(isStacked ? start : 0)],
						['y', svgValue(bar.start)],
						['width', svgValue(Math.max(extent, 0))],
						['height', svgValue(bar.width)]
					];
				}

				shapes.push(element('rect', attributes.concat([['fill', 'var(--charty-series)']])));

				if (context.options.numbers) {
					if (orientation === 'vertical') {
						valueLabels.push(label(displayValue(value),
							bar.centre,
							isStacked ? start + extent / 2 : 100 - extent - 2.5,
							'middle', 'middle', backdrop(context)));
					} else {
						valueLabels.push(label(displayValue(value),
							isStacked ? start + extent / 2 : extent + 2,
							bar.centre,
							isStacked ? 'middle' : 'start', 'middle', backdrop(context)));
					}
				}

				if (context.options.labels && isSimple && item.label) {
					categoryLabels.push(orientation === 'vertical'
						? label(item.label, bar.centre, 104, 'middle', 'hanging')
						: label(item.label, -3, bar.centre, 'end'));
				}
			});

			chart.canvas.push(seriesGroup(context, index, shapes.concat([
				valueLabels.length
					? element('g', [['class', 'charty__values']], valueLabels)
					: ''
			])));

			chart.legendValues.push(null);
		});

		if (categoryLabels.length) {
			chart.canvas.push(element('g', [
				['class', 'charty__categories'], ['aria-hidden', 'true']
			], categoryLabels));
		}

		return chart;
	}

	// -- rating

	function renderRating(context) {
		var chart = blankChart(),
			maximum = (context.statistics.rows[0] || {}).maximum || 0,
			scale = maximum > 0 ? maximum : 1;

		var rows = context.series.map(function (series, index) {
			var value = series.values[0] || 0,
				fraction = Math.min(Math.max(value / scale, 0), 1);

			return element('div', [
				['class', 'charty__rating'],
				['data-series', String(index)],
				colourStyle(context, index)
			], [
				context.options.labels && series.label
					? element('span', [['class', 'charty__rating-label']],
						[escapeText(series.label, false)])
					: '',
				context.options.numbers
					? element('span', [['class', 'charty__rating-value']],
						[escapeText(displayValue(value), false)])
					: '',
				element('div', [
					['class', 'charty__rating-track'],
					['role', 'meter'],
					['aria-valuenow', displayValue(value)],
					['aria-valuemin', '0'],
					['aria-valuemax', displayValue(scale)],
					['aria-label', series.label]
				], [
					element('div', [
						['class', 'charty__rating-fill'],
						['style', 'inline-size: ' + percentageValue(fraction, 2)]
					])
				])
			]);
		});

		chart.htmlBody = element('div', [['class', 'charty__ratings']], rows);

		chart.footnote = element('p', [['class', 'charty__footnote']], [
			'Ratings are out of a total of ',
			element('strong', [], [escapeText(displayValue(scale), false)])
		]);

		return chart;
	}

	function blankChart() {
		return {
			canvas: [],
			defs: [],
			groupAttributes: [],
			legendValues: [],
			axes: null,
			htmlBody: null,
			footnote: null,
			viewBox: '0 0 100 100'
		};
	}

	var RENDERERS = {
		radar: renderRadar,
		area: renderArea,
		pie: renderCircle,
		donut: renderCircle,
		section: renderCircle,
		ring: renderRing,
		plot: renderPlot,
		line: renderPlot,
		bubble: renderPlot,
		bar: renderBar,
		column: renderBar,
		'bar-stack': renderBar,
		'column-stack': renderBar,
		rating: renderRating
	};

	//
	// MARK: - assembler
	//

	function assemble(context, chart) {
		var classes = ['charty', 'charty--' + context.type];

		if (AXES_TYPES.indexOf(context.type) !== -1 && context.options.labels) {
			classes.push('charty--axes');
		}

		var showsLegend = context.options.legend &&
			context.type !== 'rating' &&
			context.series.length > 0;

		if (showsLegend) { classes.push('charty--legend'); }

		var attributes = [
			['class', classes.join(' ')],
			['data-charty', context.type]
		];

		if (context.colourScheme) {
			attributes.push(['style', 'color-scheme: ' + context.colourScheme]);
		}

		return element('figure', attributes, [
			buildHeader(context),
			element('div', [['class', 'charty__container']], [
				buildBody(context, chart),
				showsLegend ? buildLegend(context, chart) : ''
			]),
			chart.footnote || ''
		]);
	}

	function buildHeader(context) {
		if (!context.title && !context.caption) { return ''; }

		return element('figcaption', [['class', 'charty__header']], [
			context.title
				? element('h3', [
					['class', 'charty__title'],
					['id', context.identifier + '-title']
				], [escapeText(context.title, false)])
				: '',
			context.caption
				? element('p', [
					['class', 'charty__caption'],
					['id', context.identifier + '-caption']
				], [escapeText(context.caption, false)])
				: ''
		]);
	}

	function buildBody(context, chart) {
		var children = [];

		if (chart.axes && context.options.labels) {
			if (chart.axes.vertical) {
				children.push(element('span', [
					['class', 'charty__axis charty__axis--vertical']
				], [escapeText(chart.axes.vertical, false)]));
			}
			children.push(buildCanvas(context, chart));
			if (chart.axes.horizontal) {
				children.push(element('span', [
					['class', 'charty__axis charty__axis--horizontal']
				], [escapeText(chart.axes.horizontal, false)]));
			}
		} else {
			children.push(buildCanvas(context, chart));
		}

		return element('div', [['class', 'charty__plot']], children);
	}

	function defaultName(context) {
		return context.type.replace(/-/g, ' ') + ' chart';
	}

	function buildCanvas(context, chart) {
		if (chart.htmlBody !== null) {
			var name = [context.title, context.caption].filter(Boolean).join('. ');
			return element('div', [
				['class', 'charty__canvas'],
				['role', 'img'],
				['aria-label', name || defaultName(context)]
			], [chart.htmlBody]);
		}

		return element('div', [['class', 'charty__canvas']], [buildSVG(context, chart)]);
	}

	function buildSVG(context, chart) {
		// A chart with no title of its own still needs a name, otherwise it is
		// announced as an unlabelled graphic.
		var labelledBy = [context.identifier + '-svg-title'],
			children = [
				element('title', [['id', context.identifier + '-svg-title']],
					[escapeText(context.title || defaultName(context), false)])
			];

		if (context.caption) {
			labelledBy.push(context.identifier + '-svg-desc');
			children.push(element('desc', [['id', context.identifier + '-svg-desc']],
				[escapeText(context.caption, false)]));
		}

		var defs = chart.defs.slice();

		if (context.options.numbers) {
			// The identifier is scoped to this chart; a fixed one meant every
			// chart after the first referenced the first chart's filter.
			defs.push(element('filter', [
				['id', context.identifier + '-backdrop'],
				['x', '-0.2'], ['y', '-0.15'], ['width', '1.4'], ['height', '1.3']
			], [
				element('feFlood', [['flood-color', 'var(--charty-surface)']]),
				element('feComposite', [['in', 'SourceGraphic'], ['operator', 'over']])
			]));
		}

		if (defs.length) {
			children.push(element('defs', [], defs));
		}

		children.push(element('g',
			[['class', 'charty__data']].concat(chart.groupAttributes),
			chart.canvas));

		return element('svg', [
			['class', 'charty__svg'],
			['viewBox', chart.viewBox],
			['preserveAspectRatio', 'xMidYMid meet'],
			['role', 'img'],
			['aria-labelledby', labelledBy.join(' ')],
			['xmlns', 'http://www.w3.org/2000/svg']
		], children);
	}

	// Legend entries carry data-series so the stylesheet can pair an entry with
	// its shape using :has(), which is what removed the two event listeners
	// this plugin used to attach on every page render.
	function buildLegend(context, chart) {
		var items = context.series.map(function (series, index) {
			var value = chart.legendValues[index];

			return element('li', [
				['class', 'charty__legend-item'],
				['data-series', String(index)],
				['tabindex', '0'],
				colourStyle(context, index)
			], [
				element('span', [['class', 'charty__swatch'], ['aria-hidden', 'true']]),
				context.options.labels && series.label
					? element('span', [['class', 'charty__legend-label']],
						[escapeText(series.label, false)])
					: '',
				value
					? element('span', [['class', 'charty__legend-value']],
						[escapeText(value, false)])
					: ''
			]);
		});

		return element('ul', [
			['class', 'charty__legend'],
			['aria-label', 'Legend']
		], items);
	}

	//
	// MARK: - entry point
	//

	function renderChart(body, settings) {
		var raw;

		try {
			raw = JSON.parse(body);
		} catch (error) {
			if (settings.debug) {
				console.warn('[Charty] Skipped a chart: the block is not valid JSON —', error.message);
			}
			return null;
		}

		var type = resolveType(raw.type);

		if (!type) {
			if (settings.debug) {
				console.warn('[Charty] Skipped a chart: "' + raw.type + '" is not a chart type Charty knows about');
			}
			return null;
		}

		var rawData = Array.isArray(raw.data) ? raw.data : (raw.data ? [raw.data] : []),
			series = rawData.map(normaliseSeries);

		if (!series.length) {
			if (settings.debug) {
				console.warn('[Charty] Skipped a chart: the chart has no data to draw');
			}
			return null;
		}

		var options = normaliseOptions(raw.options),
			theme = colourFromHex(options.theme) || colourFromHex(settings.theme) || DEFAULT_THEME,
			generated = palette(theme, series.length);

		var context = {
			type: type,
			title: raw.title ? String(raw.title) : null,
			caption: raw.caption ? String(raw.caption) : null,
			series: series,
			options: options,
			statistics: statistics(series),
			identifier: identifierFor(body),
			colourScheme: settings.colourScheme,
			points: Array.isArray(raw.points)
				? raw.points.map(String)
				: (series[0] && series[0].points ? series[0].points : []),
			colours: series.map(function (item, index) {
				if (!item.colour) { return generated[index]; }

				var parsed = colourFromHex(item.colour);
				return {
					css: item.colour,
					ink: (!parsed || parsed.lightness > 0.62) ? DARK_INK : LIGHT_INK
				};
			}),
			warn: function (message) {
				if (settings.debug) { console.warn('[Charty] ' + message); }
			}
		};

		return assemble(context, RENDERERS[type](context));
	}

	//
	// MARK: - docsify plugin
	//

	// "system" writes no color-scheme of its own. Forcing "light dark" would
	// resolve every light-dark() colour against the reader's system setting
	// even on a site that only has a light theme, leaving dark-mode charts on
	// a light page. Inheriting means the charts match the page they are on.
	var COLOUR_SCHEMES = { light: 'light', dark: 'dark', system: null };

	function readSettings() {
		var configured = (window.$docsify && window.$docsify.charty) || {};

		return {
			theme: configured.theme || '#0984E3',
			// "system" follows the reader's own setting, and is the default;
			// series colours are emitted with light-dark() so the browser
			// resolves them with no script involved.
			colourScheme: Object.prototype.hasOwnProperty.call(COLOUR_SCHEMES, configured.mode)
				? COLOUR_SCHEMES[configured.mode]
				: null,
			debug: configured.debug === true
		};
	}

	function charty(hook) {
		var settings = readSettings();

		hook.afterEach(function (html, next) {
			var container = document.createElement('div');
			container.innerHTML = html;

			container.querySelectorAll('pre[data-lang=charty]').forEach(function (block) {
				var markup = renderChart(block.textContent, settings);

				if (!markup) { return; }

				var replacement = document.createElement('div');
				replacement.innerHTML = markup;
				block.parentNode.replaceChild(replacement.firstElementChild, block);
			});

			next(container.innerHTML);
		});
	}

	if (typeof window !== 'undefined' && window.$docsify) {
		window.$docsify.plugins = [].concat(charty, window.$docsify.plugins || []);
	}

	// Exported for the parity check that diffs this against the Swift port.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = {
			renderChart: renderChart,
			resolveType: resolveType,
			colourFromHex: colourFromHex,
			palette: palette,
			identifierFor: identifierFor
		};
	}
})();
