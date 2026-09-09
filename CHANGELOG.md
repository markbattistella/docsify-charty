# Changelog

## Unreleased

Charty is now two ports of one implementation: this plugin and
[publish-plugin-charty](https://github.com/markbattistella/publish-plugin-charty)
for [Publish](https://github.com/JohnSundell/Publish). They share a stylesheet
and emit byte-identical markup, so a chart looks the same on either site.

### Breaking

- Class names changed from `docsify-charty` to `charty`, and the internals moved
  to a BEM-style naming scheme (`charty__legend`, `charty__series`, and so on).
  Custom CSS written against the old names needs updating.
- `legend`, `labels`, and `numbers` now default to `true`, matching what the
  README has always documented. They previously defaulted to `false` whenever
  the key was absent, because `undefined` is falsy.
- `mode` now accepts `system` as well as `light` and `dark`, and `system` is the
  default. It follows the surrounding page rather than forcing a scheme.
- The legend is now a `<ul>`, not a `<fieldset>`.
- Browser support starts at the 2023–2024 baseline: `:has()`, `light-dark()`,
  `oklch()`, CSS nesting, and container queries. Older browsers get the markup
  and the data without the styling.

### Changed

- Value labels are revealed on hover, or when a legend entry takes keyboard
  focus, rather than being drawn permanently. Showing every number at once
  buried the shape of the data under the labels.
- Charts with a value axis round it up to a readable ceiling and step it in
  even intervals. An axis topping out at 217 now runs to 250 in fifties, rather
  than being divided into ten equal parts and labelled 22, 43, 65, 87.
- Bars are spaced by group. Bars within a group sit close together and groups
  sit apart, so the grouping reads at a glance. A chart with one value per
  series now gives each series its own slot along the axis instead of packing
  them all into a single group.

### Fixed

- The first series is no longer black. Palettes are generated in OKLCH across a
  clamped lightness range instead of multiplying HSL lightness by the series
  index across 0–98%.
- A pie or donut with a single data point rendered as an empty box. An arc whose
  start and end coincide draws nothing; a full circle is now drawn instead.
- Element identifiers inside the SVG (`text-bg`, `donut-hole`) were hard-coded,
  so every chart after the first on a page referenced the first chart's filter
  and mask. They are now derived from the chart's contents.
- Titles, captions, and labels were written into `innerHTML` unescaped, which
  made any chart definition an injection vector. Everything is escaped now.
- A chart whose values were all zero divided by zero and wrote `NaN` into the
  SVG. Scales now fall back to 1.
- Ring percentages multiplied a `toFixed` string by 100, showing values such as
  `76.00000000000001%`.
- A missing `options` key threw a `TypeError` and stopped the whole page from
  rendering.
- A missing `title` or `caption` put the string `undefined` into the SVG's
  `<title>` and `<desc>`.
- Horizontal bar charts (`column`) were produced by rotating the SVG group 90°,
  which turned every tick number and category label on its side. The geometry is
  mirrored instead, so text stays upright.
- Grouped bar charts repeated the same series name under every group.
- The value axis was labelled from the top down and never labelled zero.
- Axis titles were drawn with `attr()` in `::before`/`::after` at a negative
  z-index, which put them behind the page.
- Radar axis labels were rotated into place and ran upside-down on the left half
  of the chart.
- A radar chart with no `points` silently rendered nothing.
- A stray `console.log` ran on every page load.

### Added

- Charts follow the reader's colour scheme through CSS `light-dark()`, with no
  script involved.
- Highlighting a series from the legend is done with `:has()` instead of two
  event listeners, and now works from the keyboard as well as the pointer.
- Real accessibility: `role="img"`, `aria-labelledby`, a name for untitled
  charts, and `role="meter"` on rating bars.
- `points` may be given at the top level of a chart, not only on the first
  series.
- Layout responds to the chart's own width with container queries, so a chart in
  a narrow column stacks even on a wide screen.
- `prefers-reduced-motion` and print styles.
- Rounded bar corners, bar gaps, and value labels fanned across series so they
  do not stack on top of each other.
