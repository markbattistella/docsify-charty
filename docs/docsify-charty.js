/*! docsify-charty.js v0.0.1 | (c) Mark Battistella */

'use strict';


// get the options
function getChartyOptions( chartyOptions ) {

	// if it is empty
//	if( !chartyOptions.theme ) {
//		return 'No config set'
//	}

	// create the array variables
	let theme	= chartyOptions.theme ?
					chartyOptions.theme : '#0984e3';


// "title"
// "config"
// "type"
// "color"
// "labels"
// "numbers"
// "data"




	// build the array
	var outputArray = [
		theme
	];

	return outputArray;
}

// defaults - and setup
const chartyOptions = {
	theme:	''
};


// the function
function charty( hook, vm ) {

	// get the variables from the cofig
	const	chartyOptionsArray = getChartyOptions( chartyOptions ),

			// create global options
			arrayID		= chartyOptionsArray[0];


	//
	// MARK: - custom functions
	//

	// find the arc co-ordinates
	function getCoordinatesForPercent( value ) {
		const	x = Math.cos( 2 * Math.PI * value ),
				y = Math.sin( 2 * Math.PI * value );

		return [x, y];
	}

	// check if correctly parsed json
	function isJSON( string ) {
		try {
			JSON.parse( string );
		} catch( error ) {
			console.log( error );
			return false;
		}
		return true;
	}


	//
	// MARK: - after the markdown has been parsed
	//
	hook.afterEach(function( html, next ) {

		// we load the HTML inside a DOM node to allow for manipulation
		var htmlElement = document.createElement('div');

		// insert the html into the new element
		htmlElement.innerHTML = html;

		// find all the charty <pre> tags
		htmlElement.querySelectorAll( 'pre[data-lang=charty]' ).forEach(

			// what to do
			function( element ) {

				//
				// create the variables
				//

				// -- let variables
				let replacement		= document.createElement( 'div' ),

					// blank the rest of the options
					charty			= '',		// full container
					chartyHeader	= '',		// header of chart
					chartyData		= '',		// the inner data

					// data customisations
					dataColor,
					dataLabel,
					dataNumber,
					dataSize,
					dataPercent,
					dataColorHole;

				// assemble the div
				// -- add in the contents
				replacement.textContent = element.textContent;

				// check if the innerHTML is json
				if( ! isJSON( replacement.innerHTML ) ) {
					return;
				}

				// -- constansts
				const	jsonData		= JSON.parse( replacement.innerHTML ),
						jsonConfig		= jsonData.config,
						dataArray		= jsonData.data,

						// for svg
						w3				= 'http://www.w3.org/2000/svg',

						// customistations
						chartyType		=	jsonConfig.type ?
												`charty-${jsonConfig.type}` :
												null,

						chartyTheme		=	jsonConfig.color ?
												jsonConfig.color : 'white',

						chartyLabel		=	jsonConfig.labels ? true : false,

						chartyNumbers	=	jsonConfig.numbers ? true :	false,

						totalValue		=	dataArray.reduce( ( acc, val ) => {
											// min
											acc[0] = (( acc[0] === undefined || val.value < acc[0] ) ?
												val.value :
												acc[0]
											)

											// max
											acc[1] = (( acc[1] === undefined || val.value > acc[1] ) ?
												val.value :
												acc[1]
											)

											// total
											acc[2] = ( acc[2] === undefined ?
												val.value :
												val.value + acc[2]
											)

											return acc;
										}, [] ),

							// check if grouping for comparison
							dataGroups	= (

								// has groups
								( 	jsonConfig.groups &&
									!isNaN( jsonConfig.groups )
								) ?

									// total is divisible
									( (dataArray.length % jsonConfig.groups === 0) || (chartyType === 'charty-rating') ) ?

									// the group spacing
									jsonConfig.groups :

										// the default
										1 :

									// catch-all
									1
									),

							itemType	= ( chartyType.endsWith('column') ?
												'row' :
												'column'
										);


				// add the class
				// set the type attribute
				replacement.classList.add( 'charty' );
				replacement.setAttribute( 'type', chartyType );


				//
				// MARK: - switch the type
				//
				switch( chartyType ) {

					// pie chart
					// doughnut chart
					case 'charty-pie'		:
					case 'charty-donut'		: // US
					case 'charty-doughnut'	: // AUS

						// variables
						var svg				= document.createElementNS(
												w3, 'svg'
											),
							group			= document.createElementNS(
												w3, 'g'
											),
							flexbox			= document.createElement(
												'div'
											),
							legend			= document.createElement(
												'fieldset'
											);

						let valueSum		= 0,
							diffence		= 0;

						// -- svg container
						svg.setAttribute( 'class', 'charty-rows' );
						svg.setAttributeNS(
							null,						// namespace
							'viewBox',					// attribute
							'0 0 100 100'				// value
						);
						svg.setAttributeNS(
							null,						// namespace
							'preserveAspectRatio',		// attribute
							'xMaxYMin meet'				// value
						);

						// -- flexbox container
						flexbox.setAttribute( 'class', 'charty-columns' );

						// -- group container
						group.style.transform = 'rotate(-90deg)';

						// -- legend container
						legend.setAttribute( 'class', 'charty-rows' );
						legend.innerHTML = '<legend>Legend</legend>';


						// loop through each data object
						dataArray.forEach( data => {

							// config: colour - global
							dataColor	= data.color ?
												data.color : '';

							// config: get the percent
							dataPercent	= chartyNumbers ?
											( ( data.value / totalValue[2] ) * 100 ).toFixed( 2 ) : '';

							// config: value numbers
							dataNumber	= chartyNumbers ?
											` (${data.value} - ${dataPercent}%)` :
											'';

							// compound the value
							valueSum += data.value;

							// calculate the difference
							diffence  = ( totalValue[2] - data.value );

							// create a path
							const path = document.createElementNS( w3, 'path' );

							// add the attributes
							path.setAttribute(
								'stroke-dasharray',
								`${data.value} ${diffence}`
							);
							path.setAttribute(
								'stroke-dashoffset',
								valueSum
							);
							path.setAttribute(
								'stroke',
								data.color
							);
							path.setAttribute(
								'pathLength',
								totalValue[2]
							);
							path.setAttribute(
								'stroke-width',
								'50'
							);
							path.setAttribute(
								'd',
								'M75 50a1 1 90 10-50 0a1 1 90 10 50 0'
							);
							path.setAttribute(
								'fill',
								'none'
							);

							// add the path(s) to the group
							svg.appendChild( path );

							// insert the legend items
							legend.innerHTML += `<label><span style="background:${dataColor};"></span>${data.label} ${dataNumber}</label>`;

						});

						// if it is a doughnut chart
						if(
							chartyType === 'charty-doughnut' ||
							chartyType === 'charty-donut'
						) {

							// make a circle
							const	middleHole = document.createElementNS(
													w3, 'circle'
												);

							// [50%, 50%] @ 25% width
							middleHole.setAttribute( 'cx', '50'	);
							middleHole.setAttribute( 'cy', '50'	);
							middleHole.setAttribute( 'r',  '25%'	);
							middleHole.setAttribute( 'fill', chartyTheme	);

							// overlay it
							svg.appendChild( middleHole );
						}

						// add the svg to the flexbox element
						flexbox.appendChild( svg );

						// if there is a legend to display
						if( chartyLabel ) {
							flexbox.appendChild( legend );
						}

						// add to the DOM
						charty = flexbox.outerHTML;

						break;



					// pie chart not whole
					case 'charty-section'	:
					case 'charty-sectional'	:

						// variables
						var svg				= document.createElementNS(
												w3, 'svg'
											),
							group			= document.createElementNS(
												w3, 'g'
											),
							flexbox			= document.createElement(
												'div'
											),
							legend			= document.createElement(
												'fieldset'
											);

						let totalPercent	= 0;

						// -- svg container
						svg.setAttribute( 'class', 'charty-rows' );
						svg.setAttributeNS(
							null,						// namespace
							'viewBox',					// attribute
							'-1 -1 2 2'					// value
						);
						svg.setAttributeNS(
							null,						// namespace
							'preserveAspectRatio',		// attribute
							'xMaxYMin meet'				// value
						);

						// -- flexbox container
						flexbox.setAttribute( 'class', 'charty-columns' );

						// -- group container
						group.style.transform = 'rotate(-90deg)';

						// -- legend container
						legend.setAttribute( 'class', 'charty-rows' );
						legend.innerHTML = '<legend>Legend</legend>';

						// loop through each data object
						dataArray.forEach( data => {

							// config: colour - global
							dataColor	= data.color ? data.color : '';

							// config: value numbers
							dataNumber	= chartyNumbers ?
											` (${data.value.toFixed(2)*100}%)` : '';

							// destructuring assignment
							// -- sets the two variables at once
							const [startX, startY] = getCoordinatesForPercent(
														totalPercent
													);

							// each slice starts where the last slice ended
							// -- so keep a cumulative percent
							totalPercent += data.value;

							const [endX, endY] =	getCoordinatesForPercent(
														totalPercent
													);

							// if the slice is more than 50%
							// take the large arc (the long way around)
							const largeArcFlag = data.value > 0.5 ? 1 : 0;

							// create an array
							// -- join it just for code readability
							const pathData = [
								// Move
								`M ${startX} ${startY}`,

								// Arc
								`A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,

								//  Line
								`L 0 0`,
							].join(' ');

							// create a path
							const path = document.createElementNS( w3, 'path' );

							// add the attributes
							path.setAttribute( 'd', pathData );
							path.setAttribute( 'fill', dataColor );

							// insert the legend items
							legend.innerHTML += `<label><span style="background:${dataColor};"></span>${data.label}${dataNumber}</label>`;

							// add the paths to the group
							group.appendChild( path );
						});

						// add the svg to the flexbox element
						svg.appendChild( group );
						flexbox.appendChild( svg );

						// is there a legend
						if( chartyLabel ) {
							flexbox.appendChild( legend );
						}

						// less the `1` or 100%
						charty =	( totalPercent <= 1 ?

										// insert the html elements
										flexbox.outerHTML :

										// error: log that >100%
										(console.log( 'ERROR: value is greater than 100%' ),
										null)
									);

						break;



					// column chart
					// bar chart
					case 'charty-column'	:
					case 'charty-bar'		:

						// loop through each data object
						dataArray.forEach( (data, index) => {

							// config: colour - global
							dataColor	= data.color ?
											`background:${data.color};` : '';

							// config: base label
							dataLabel	= chartyLabel ?
											`data-label="${data.label}"`	:
											'';

							// config: top numbers
							dataNumber	= chartyNumbers ?
											`data-number="${data.value}"`	:
											'';

							// config: bar height
							dataSize 	= `grid-${itemType}-start: calc( 100 -
											(${data.value} / ${totalValue[1]})
												* 100 );`;

							// config: group spacing
							const dataSpacing = (
								( (index + 1) % dataGroups === 0 ||
									dataGroups === dataArray.length
								) ?

									(chartyType.endsWith('column') ?
										'margin-right: 10px;' :
										'margin-bottom: 10px;') :
									''
							);

							// build the data
							chartyData += `<div class="data"
												style="${dataSize}
												${dataColor}${dataSpacing}"
												${dataLabel}
												${dataNumber}
											>
											</div>`;
						});

						// assembly
						charty =	`<div class="data-set">
											${chartyData}
									</div>`;

						break;



					// line graph
					// plot graph
					case 'charty-line' :
					case 'charty-plot' :

						const	widgetSize = getComputedStyle(
												document.documentElement
											).getPropertyValue(
												'--graph-size'
											).trim(),

								base = ( widgetSize / dataArray.length ),

								topMostPoint = totalValue[1],

								pointSize = ( base / 2 ),

								radiansToDegrees = (rads) =>
									rads * (180 / Math.PI);

						let leftOffset = pointSize,
							nextPoint = 0,
							rise = 0,
							cssValues = [];

						// loop the data
						for(
							var i = 0,
							len = dataArray.length - 1;
							i < len;
							i++
						) {

							// create some blanks
							var currentValue = {
									value: 0,
									left: 0,
									bottom: 0,
									hypotenuse: 0,
									angle: 0
								};

							// add the current data
							currentValue.value	 = dataArray[i].value;
							currentValue.left	 = leftOffset;
							leftOffset			+= base;

							currentValue.bottom  = (
								(widgetSize - pointSize) *
								(currentValue.value / topMostPoint)
							);

							nextPoint			 = (
								(widgetSize - pointSize) *
								(dataArray[i+1].value / topMostPoint)
							);

							rise				 = (
								currentValue.bottom - nextPoint
							);
							currentValue.hypotenuse = Math.sqrt(
								(base * base) + (rise * rise)
							);

							currentValue.angle	 = radiansToDegrees(
								Math.asin(rise / currentValue.hypotenuse)
							);

							// add them to the array
							cssValues.push(currentValue);
						}

						// last point different data
						var lastPoint = {
							value: dataArray[dataArray.length - 1].value,
							left: leftOffset,
							bottom: (widgetSize - pointSize) * (dataArray[dataArray.length - 1].value / topMostPoint),
							hypotenuse: 0,
							angle: 0
						};

						// add the last item data to array
						cssValues.push(lastPoint);

						// loop through the markdown
						dataArray.forEach( (data, index) => {

							// config: colour - global
							dataColor	= data.color ?
										`style="background:${data.color};"` :
										'';

							// config: base label
							dataLabel	= chartyLabel ?
											`data-label="${data.label}"` : '';

							// config: top numbers
							dataNumber	= chartyNumbers ?
											`data-number="${data.value}"` : '';

							const dataLine = ( chartyType === 'charty-line' ?
												// true
												`<div class="segment" style="
													--hypotenuse: ${cssValues[index].hypotenuse};
													--angle: ${cssValues[index].angle};"
												></div>` :
												''
											);

							// add the data
							chartyData += `<li style="
								--x: ${cssValues[index].left};
								--y: ${cssValues[index].bottom};
							">
								<div class="data-point"
									${dataColor}
									${dataLabel}
									${dataNumber}
								></div>
								${dataLine}
							</li>`;

						});

						// assembly
						charty =	`<figure>
										<ul>${chartyData}</ul>
										<figcaption>
											<small><em>
												Hover to see values
											</em></small>
										<figcaption>
									</figure>`;

						break;



					// rating chart
					case 'charty-rating' :

						// loop through each data object
						dataArray.forEach( data => {

							// config: colour - global
							dataColor	= data.color ?
											`background:${data.color};` : '';

							// config: label
							dataLabel	= chartyLabel ?
											`<div class="rating-label">${data.label}</div>`	:
											'';

							// config: rating numbers
							dataNumber	= chartyNumbers ?

											// higher than max rating
											( data.value > dataGroups ) ?
												`<div class="rating-value">
													${dataGroups}
												</div>` :

												( data.value < 0 ) ?
													'<div class="rating-value">0</div>' :

												// is less than max rating
												`<div class="rating-value">${data.value}</div>` : '';

							// config: bar width
							const widthPercent = ( data.value > dataGroups ) ?
							 						'100%' :

													( data.value < 0 ) ?
														'0' :

													( ( data.value / dataGroups ) * 100 ) + '%';

							dataSize 	= `<div class="rating-bar-container"><div class="rating-bar-color" style="width: ${widthPercent};${dataColor}">&nbsp;</div></div>`;

							// build the data
							chartyData += `<div class="rating-row">
											${dataLabel}
											${dataNumber}
											${dataSize}
										</div>`;
					});

					// assembly
					charty =	`<figure class="rating">
									${chartyData}
									<figcaption><small><em>Ratings are out of a total of <strong>${dataGroups}</strong></em></small><figcaption>
								</figure>`;
						break;



					// exit if not matched
					default:
						return;
				}


				// check before changing DOM
				if( charty ) {

					// add the header (if present)
					chartyHeader =	jsonData.title == ""	||
									!jsonData.title			?
										chartyHeader		:
										`<h3>${jsonData.title}</h3>`;


					// add in the bars
					replacement.innerHTML = `${chartyHeader} ${charty}`;

					// commit the manipulation
					element.parentNode.replaceChild(replacement, element);

				} else {

					// exit if no changes
					return;
				}
			}
		);

		// docsify return data
		next(htmlElement.innerHTML);

	});

}


// docsify plugin options
window.$docsify.charty = Object.assign( chartyOptions, window.$docsify.charty );
window.$docsify.plugins = [].concat(charty, window.$docsify.plugins);
