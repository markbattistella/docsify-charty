/*
 * docsify-charty.js v2.0.1 (https://markbattistella.github.io/docsify-charty/)
 * Copyright (c) 2021 Mark Battistella (@markbattistella)
 * Licensed under MIT
 */

//
// MARK: - safety first
//
'use strict';





//
// MARK: - get the docsify.config options
//
function getChartyOptions( chartyOptions ) {

	const	chartyTheme = ( chartyOptions.theme != '' ?
								chartyOptions.theme :
								'#0984E3'
						),
			chartyMode	= ( chartyOptions.mode != '' ?
								chartyOptions.mode :
								'light'
						),
			chartyDebug	= ( chartyOptions.debug === true ?
		 						true :
								false
						);

	// build the array
	const outputArray = [
		chartyTheme,	// colour to use for shades
		chartyMode,		// light or dark mode
		chartyDebug		// show debug messages
	];

	// output
	return outputArray;
}





//
// MARK: - default configuration settings
//
const chartyOptions = {
	theme:	'',
	mode:	'light',
	debug:	0
};





//
// MARK: - main function
//
function charty( hook, vm ) {

	// get the variables from the cofig
	const	chartyOptionsArray = getChartyOptions( chartyOptions ),

			// create global options
			configTheme		= chartyOptionsArray[0],
			configMode		= chartyOptionsArray[1],
			configDebug		= chartyOptionsArray[2],

			acceptedCharts		= [
				'radar',
				'area',
				'donut',
				'doughnut',
				'pie',
				'section',
				'sectional',
				'rings',
				'line',
				'plot',
				'scatter',
				'bubble',
				'rating',
				'review',
				'bar',
				'column',
				'bar-stack',
				'bar-stacked',
				'column-stack',
				'column-stacked'
			];

console.log( configDebug );
	//
	// MARK: - custom local functions
	//

	// function: find the arc co-ordinates
	function getCoordinatesFromPercent( percentage ) {

				// math angles are in radian not degrees
		const	degreeToRadian = ( 360 * Math.PI / 180 ),

				// x = centerX + radius * cos( angleInRadians )
				x = 50 + 50 * Math.cos( degreeToRadian * percentage ),

				// y = centerY + radius * sin( angleInRadians )
			  	y = 50 + 50 * Math.sin( degreeToRadian * percentage );

		return [x, y];
	}

	// function: check if correctly parsed json
	function isJSON( string ) {
		try {
			JSON.parse( string );
		} catch( error ) {
			console.log( error );
			return false;
		}
		return true;
	}

	// function: colour to HSL
	function colourHEXToHSL( hex, number = 1 ) {

		// strip the hash
		hex = hex.replace( /#/g, '' );

		// convert 3 character hex to 6
		if( hex.length === 3 ) {
			hex = hex.split( '' ).map(function( hex ) {
				return hex + hex;
			}).join( '' );
		}

		// check if we are in the legal range
		var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec( hex );

		// exit if not hex
		if( !result ) {
			return null;
		}

		// variables
		var r = ( parseInt(result[1], 16) / 255 ),
			g = ( parseInt(result[2], 16) / 255 ),
			b = ( parseInt(result[3], 16) / 255 ),

			max = Math.max(r, g, b),
			min = Math.min(r, g, b),

			h,
			s,
			l = (max + min) / 2;

		// monochromatic
		if( max == min ) {

			h = s = 0;

		} else {

			var d = max - min;

			s = ( l > 0.5 ? d / (2 - max - min) : d / (max + min) );

			switch( max ) {

				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;

				case g:
					h = (b - r) / d + 2;
					break;

				case b:
					h = (r - g) / d + 4;
					break;

			}

			h /= 6;
		}

		// saturation
		s = Math.round( s * 100 );

		// hue
		h = Math.round(360 * h);

		// get the shades
		if( number != 1 && number < 101 && number > 0 ) {
			l = Math.round( 98 / number );
		} else {
			l = Math.round( l * 100 );
		}

		// return it
		return { h: h, s: s, l: l };
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
		htmlElement
			.querySelectorAll( 'pre[data-lang=charty]' )
			.forEach( function( element ) {

				//
				// MARK: - create the variables
				//

				// -- let variables
				let replacement		= document.createElement( 'figure' ),

					// blank the rest of the options
					chartyContainer,		// <figure>
					chartyHeader,			// <h3>
					chartyCaption,			// <figcaption>
					chartyDataGroup,		// data-group
					chartyDataItem,			// data-item

					// data customisations
					chartyDataItemColour,	// data-item - colour
					chartyDataItemLabel,	// data-item - label
					chartyDataItemValue;	// data-item - value


				// assemble the div
				// -- add in the contents
				replacement.textContent = element.textContent;

				// check if the innerHTML is json
				if( ! isJSON( replacement.innerHTML ) ) {

					// exit if not conformed
					return;
				}


				// -- constansts

				// namespace for svg
				const chartySVGw3 = 'http://www.w3.org/2000/svg',

				// parse the data
				chartyJSON = JSON.parse(

					// get the html to parse
					replacement.innerHTML

						// replace color --> colour
						.replace( /"color":/g, '"colour":' )
				),

				// @return: type of chart
				chartyType = (

					// does it have a type listed
					chartyJSON.type &&

					// is it in the list of accepted types
					acceptedCharts.includes( chartyJSON.type )

					? (

					// spelling: doughnut
					chartyJSON.type === 'doughnut'	? 'donut'	:

					// spelling: sectional
					chartyJSON.type === 'sectional'	? 'section'	:

					// spelling: rings
					chartyJSON.type === 'rings'		? 'ring'	:

					// spelling: scatter
					chartyJSON.type === 'scatter'	? 'plot'	:

					// spelling: review
					chartyJSON.type === 'review'	? 'rating'	:

					// spelling: *-stacked
					chartyJSON.type.endsWith( '-stacked' ) ?
						chartyJSON.type.replace('-stacked', '-stack') :

					// all others
					chartyJSON.type

					) :

					// otherwise null
					null
				),

				// @return: array of options
				chartyJSONOptions		= chartyJSON.options,

				// option: charty theme
				chartyJSONOptionsTheme	= (

					// global theme AND local theme
					configTheme && chartyJSONOptions.theme ?

						// override with local
						chartyJSONOptions.theme :

						// else fallback
						configTheme
				),

				// option: show legend
				chartyJSONOptionsLegend = ( chartyJSONOptions.legend ?
					true :
					false
				),

				// option: show label
				chartyJSONOptionsLabel = ( chartyJSONOptions.labels ?
					true :
					false
				),

				// option: show number values
				chartyJSONOptionsNumbers = ( chartyJSONOptions.numbers ?
					true :
					false
				),

				// @return: array of data
				// -- turn single data into array
				chartyJSONData = Array.isArray( chartyJSON.data ) ?
					chartyJSON.data : [ chartyJSON.data ],

				// normalise the data
				// -- some data values are singlular others arrays
				normaliseData = arr => {
					const data = arr.map(({ value }) => value);
					return typeof arr[0].value === 'number' ?
						[data] : data;
				},

				// run it through normalisation
				valueArray = normaliseData( chartyJSONData ),

				// data: get smallest, largest, sum of values
				chartyMinMax = valueArray.reduce( ( arr, el ) => {

					// remove the last item in array
					const highestValue = arr.pop();

					// do a try-catch
					try {

						// check it
						// -- is an array
						// -- has more than 0
						// -- is only numbers
						if( ( Array.isArray(el) || el.length )
							&& !el.some( isNaN )
						) {

							// output on valid
							let current = {
								"min": Math.min(...el),
								"max": Math.max(...el),
								"sum": [...el].reduce((v, w) => v + w),
								"avg": (
									( [...el].reduce((v, w) => v + w) ) / [...el].length
								)
							}

							// add in the current array
							// -- min / max / sum / avg
							arr.push( current );

							// change the largest value if it now is
							if( current.max > highestValue.largest ) {
									highestValue.largest = current.max;
							}
						}

					} catch( err ) {

						return ( configDebug ?
							console.log( err ) :
						 	null );
					}

					// add in the highest number
  					arr.push( highestValue );

					// return it
					return arr;
				}, [ { largest: -Infinity } ] ),

				//
				trimLargeValue = arr => {

					// get the last of the array
					const lastInArray = arr[ arr.length - 1 ];

					// return the new merged array
				    return arr.slice( 0, -1).map( o => (
						{ ...o, ...lastInArray }
					));
				},

				// data: get smallest, largest, sum of values
				chartyJSONDataNumbers = trimLargeValue( chartyMinMax ),

				// @return: colour hsl
				// -- passed: hex colour / total numbers
				chartyColours = chartyJSONData.map( ( data, index ) => {

					// if there is a manual set colour
					if( data.colour ) {
						return data.colour;
					}

					// make the hsl data
					const hsl = colourHEXToHSL(
						chartyJSONOptionsTheme,
						chartyJSONData.length
					),

					// fix colour if only one item
					l = ( chartyJSONData.length === 1 ? 50 : 0 );

					// return the colour and lightness
					return `hsl( ${ hsl.h }, ${ hsl.s }%, ${ hsl.l * index + l }% )`;
				});


				// add the classes
				// -- main class
				replacement.classList.add( 'docsify-charty' );
				replacement.classList.add( `${ configMode }` );

				// -- axes class
				if( chartyJSONOptionsLabel &&
					[	'area',
						'plot',
						'bubble',
						'line',
						'bar',
						'column',
						'bar-stack',
						'column-stack' ].includes( chartyType )
				 ) {
					replacement.classList.add( 'axes' );
				}

				// create the parts for the switch
				var svg				= document.createElementNS(
										chartySVGw3, 'svg'
									),
					defs			= document.createElementNS(
										chartySVGw3, 'defs'
									),
					group			= document.createElementNS(
										chartySVGw3, 'g'
									),
					flexbox			= document.createElement(
										'div'
									),
					dataset			= document.createElement(
										'div'
									),
					legend			= document.createElement(
										'fieldset'
									),
					a11yTitle		= document.createElement(
										'title'
									),
					a11yCaption		= document.createElement(
										'desc'
									);

				// -- svg container
				svg.setAttributeNS(
					'charty',				// namespace
					'viewBox',				// attribute
					'0 0 100 100'			// value
				);
				svg.setAttributeNS(
					'charty',				// namespace
					'preserveAspectRatio',	// attribute
					'xMidYMid meet'			// value
				);

				// -- defs background
				defs.innerHTML = '<filter x="-0.25" y="-0.25" width="1.5" height="1.5" id="text-bg"><feFlood flood-color="var(--charty-colour-dark)"/><feComposite in="SourceGraphic" operator="over"/></filter>';

				// -- flexbox container
				flexbox.setAttributeNS(
					'charty',				// namespace
					'class',				// attribute
					'container'				// value
				);

				// -- dataset container
				dataset.setAttributeNS(
					'charty',				// namespace
					'class',				// attribute
					`dataset ${chartyType}`	// value
				);

				// -- group container
				group.setAttributeNS(
					'charty',				// namespace
					'class',				// attribute
					'data-container'		// value
				);

				// -- a11y title
				a11yTitle.innerHTML		= chartyJSON.title;
				a11yCaption.innerHTML	= chartyJSON.caption;



				//
				// MARK: - assemble the items
				//

				// add the a11y to the svg
				svg.appendChild( a11yTitle );
				svg.appendChild( a11yCaption );

				// add the defs to the svg
				if( chartyJSONOptionsNumbers ) {
					svg.appendChild( defs );
				}

				// add the group container to the svg
				svg.appendChild( group );

				// add the svg to the dataset
				// only if not rating
				if( ![ 'rating' ].includes( chartyType ) ) {
					dataset.appendChild( svg );
				}

				// add the dataset to the container
				flexbox.appendChild( dataset );

				// -- legend things
				if(
					chartyJSONOptionsLegend &&
					![ 'rating' ].includes( chartyType )
				) {

					// -- legend class
					replacement.classList.add( 'legend' );

					// add the legend
					flexbox.appendChild( legend );

					// add the title
					legend.innerHTML = '<legend>Legend</legend>';
				}





				//
				// MARK: - switch the type
				//
				switch( chartyType ) {

					// charty-radar
					case 'radar'	:

						// create the loop rings
						const	radarDataHeader = document.createElementNS(
									chartySVGw3, 'g'
								),
								radarDataLines = document.createElementNS(
									chartySVGw3, 'g'
								),
								radarDataRings = document.createElementNS(
									chartySVGw3, 'g'
								),
								radarDataText = document.createElementNS(
									chartySVGw3, 'g'
								),

								radarDataPoints = (
									chartyJSONData[0].points === undefined ?
										0 : chartyJSONData[0].points
								);

						// add the classes
						// -- group container
						radarDataHeader.setAttributeNS(
							'charty',				// namespace
							'class',				// attribute
							'data-header'			// value
						);
						radarDataLines.setAttributeNS(
							'charty',				// namespace
							'class',				// attribute
							'data-lines'			// value
						);
						radarDataRings.setAttributeNS(
							'charty',				// namespace
							'class',				// attribute
							'data-rings'			// value
						);
						radarDataText.setAttributeNS(
							'charty',				// namespace
							'class',				// attribute
							'data-label'				// value
						);

						// add the rings
						for( var i = 1; i <= 5; i++ ) {
							radarDataRings.innerHTML +=
								'<circle cx="0" cy="0" r="' +
								( i * 20 ) +
								'"/>';
						}

						// add the items to the container group
						radarDataHeader.appendChild( radarDataLines );
						radarDataHeader.appendChild( radarDataRings );

						// -- show labels
						if( chartyJSONOptionsLabel ) {
							radarDataHeader.appendChild( radarDataText );
						}


						// add in the titles for the heading rings
						if( radarDataPoints.length > 0 ) {

							// loop through the array
							radarDataPoints.forEach( ( item, i ) => {

								// constants
								const textItem = document.createElementNS(
									chartySVGw3,
									'text'
								),
								textLine = document.createElementNS(
									chartySVGw3,
									'line'
								);

								// -- item options
								textItem.setAttributeNS(
									'charty',			// namespace
									'x',				// attribute
									0					// value
								);
								textItem.setAttributeNS(
									'charty',			// namespace
									'y',				// attribute
									105				// value
								);
								textItem.setAttributeNS(
									'charty',			// namespace
									'style',			// attribute
									`--angle: ${ 360 / radarDataPoints.length * i }`
														// value
								);

								// -- item options
								textLine.setAttributeNS(
									'charty',			// namespace
									'x1',				// attribute
									0					// value
								);
								textLine.setAttributeNS(
									'charty',			// namespace
									'x2',				// attribute
									100					// value
								);
								textLine.setAttributeNS(
									'charty',			// namespace
									'y1',				// attribute
									0					// value
								);
								textLine.setAttributeNS(
									'charty',			// namespace
									'y2',				// attribute
									0					// value
								);
								textLine.setAttributeNS(
									'charty',			// namespace
									'style',			// attribute
									`--angle: ${360/radarDataPoints.length*i}`
														// value
								);

								// add the text
								textItem.innerHTML = item;

								// add it to the container
								radarDataText.appendChild( textItem );

								// add it to the container
								radarDataLines.appendChild( textLine );

							});
						}

						// add in the <g> header data
						group.appendChild( radarDataHeader );

						// loop through all the charty data lines
						chartyJSONData.forEach( ( data, index ) => {

							// error checking
							// -- if the values dont match number of points
							if( radarDataPoints.length !== data.value.length ) {
								return ( configDebug ?
									console.log( `>>> Charty input error\n --> ${data.label} has ${data.value.length} values but you have created ${radarDataPoints.length} labels - not creating the data` ) :
								 	null );
							}

							// data item container
							const radarDataItem = document.createElementNS(
								chartySVGw3,
								'g'
							),

							// -- the shape
							radarDataShape = document.createElementNS(
								chartySVGw3,
								'polygon'
							),

							// -- text container
							radarDataLabels = document.createElementNS(
								chartySVGw3,
								'g'
							);

							// radar points on spokes
							let radarPoints = '';

							// -- calculate the spokes
							data.value.forEach( ( item, i ) => {

								// error checking
								// -- if the value greater than 100
								// -- if the value less than 0
								if( item < 0 || item > 100 ) {
									return ( configDebug ?
										console.log( `>>> Charty input error\n --> ${data.label} has a value of ${item} in its array. Values need to be between 0-100` ) :
									 	null );
								}

								// -- get the percentage
								const	percent = (
									(item >= 0 && item <= 100) ?
										item / 100 :
										0
								),

								// -- the degree turn
								degree = (
									360 / radarDataPoints.length * i
								),

								// -- radians to degrees
								number = ( degree * (Math.PI / 180) ),

								// -- the X position in the arc
								radarX = (
									100 * Math.cos(number) * percent
								),

								// -- the Y position in the arc
								radarY = (
									100 * Math.sin(number) * percent
								),

								// -- text labels
								radarDataLabelText = document.createElementNS(
									chartySVGw3,
									'text'
								);

								// append the points
								radarPoints += `${radarX} ${radarY} `;

								// -- text items
								radarDataLabelText.setAttributeNS(
									'charty',			// namespace
									'x',				// attribute
									`${ radarX }`
														// value
								);
								radarDataLabelText.setAttributeNS(
									'charty',			// namespace
									'y',				// attribute
									`${ radarY }`
														// value
								);
								radarDataLabelText.setAttributeNS(
									'charty',			// namespace
									'filter',			// attribute
									'url(#text-bg)'		// value
								);

								// -- insert the text
								radarDataLabelText.innerHTML = `${item}%`;

								// -- add into the group
								radarDataLabels.appendChild(
									radarDataLabelText
								);

							});

							// -- data item
							radarDataItem.setAttributeNS(
								'charty',			// namespace
								'class',			// attribute
								'data-item'			// value
							);
							radarDataShape.setAttributeNS(
								'charty',			// namespace
								'points',			// attribute
								radarPoints			// value
							);
							radarDataShape.setAttributeNS(
								'charty',			// namespace
								'fill',				// attribute
								chartyColours[ index ]
													// value
							);

							// -- data-text class
							radarDataLabels.setAttributeNS(
								'charty',			// namespace
								'class',			// attribute
								'data-text'			// value
							);


							// if there is a legend
							if( chartyJSONOptionsLegend ) {
								legend.innerHTML += `<label><span style="background: ${chartyColours[ index ]};"></span>${data.label}</label>`;
							}

							// add in the items
							radarDataItem.appendChild( radarDataShape );

							// -- show values
							if( chartyJSONOptionsNumbers ) {
								radarDataItem.appendChild( radarDataLabels );
							}

							// add the data-item to group
							group.appendChild( radarDataItem );

						});

						break;



					// charty-area
					case 'area'			:

						// create the loop rings
						const	areaDataHeader = document.createElementNS(
							chartySVGw3, 'g'
						),

						// -- data-text
						areaDataHeaderText = document.createElementNS(
							chartySVGw3, 'g'
						),

						// -- data-lines
						areaDataHeaderLine = document.createElementNS(
							chartySVGw3, 'g'
						),

						// number of [data] points
						areaNumberInDataArray = chartyJSONData.length;

						// -- data-header class
						areaDataHeader.setAttributeNS(
							'charty',
							'class',
							'data-header'
						);
						// -- data-header class
						areaDataHeaderText.setAttributeNS(
							'charty',
							'class',
							'data-text'
						);
						// -- data-header class
						areaDataHeaderLine.setAttributeNS(
							'charty',
							'class',
							'data-line'
						);

						// -- axes
						dataset.setAttributeNS(
							'charty',
							'axes-vertical',
							'Values'
						);

						// add the lines
						for( var i = 1; i <= 10; i++ ) {

							const yPos = ( (i - 1) * 10 ),

							number = ( Math.round(
								chartyJSONDataNumbers[ 0 ].largest -
								(chartyJSONDataNumbers[ 0 ].largest / 10 * (i-1)))
							);

							areaDataHeaderLine.innerHTML +=
								`<line x1="0" x2="100"
									y1="${yPos}" y2="${yPos}"
									stroke-width="0.2"
									stroke-dasharray="4,4"
								/>`;

							areaDataHeaderText.innerHTML +=
								`<text x="${ -5 }" y="${ yPos }">${ number }</text>`;
						}

						// add them to the main container
						// -- show labels
						if( chartyJSONOptionsLabel ) {
							areaDataHeader.appendChild( areaDataHeaderText );
						}

						// -- show lines
						areaDataHeader.appendChild( areaDataHeaderLine );

						// add it into the group-container
						group.appendChild( areaDataHeader );


						// loop through all the charty data lines
						chartyJSONData.forEach( ( data, index ) => {

							// create the constants
							// -- create the polygon shape
							const areaDataPolygon = document.createElementNS(
								chartySVGw3, 'polygon'
							),

							// -- calculate the total number of points
							areaTotalPoints = ( chartyJSONData[index].value.length - 1),

							// -- check if we are looping or not
							areaCounter = (
								chartyJSONData.length > 1 ? index : 0
							),

							// -- use the largest number as the scaling
							areaDataCount = (
								chartyJSONDataNumbers[ areaCounter ].largest
							),

							// -- create the data-item
							areaDataItem = document.createElementNS(
								chartySVGw3,
								'g'
							),

							// -- the label group
							areaDataLabels = document.createElementNS(
								chartySVGw3,
								'g'
							);

							// the polygon points
							let areaPoints = '';


							// loop the values
							data.value.forEach( ( item, i ) => {

								// points average
								const areaPointAsPercent = (
									(100 - ( item / areaDataCount ) * 100)
								),
								areaDataLabelText = document.createElementNS(
									chartySVGw3,
									'text'
								);

								// -- text items
								areaDataLabelText.setAttributeNS(
									'charty',			// namespace
									'x',				// attribute
									`${ 100 / areaTotalPoints * i}`
														// value
								);
								areaDataLabelText.setAttributeNS(
									'charty',			// namespace
									'y',				// attribute
									`${ areaPointAsPercent }`
														// value
								);
								areaDataLabelText.setAttributeNS(
									'charty',			// namespace
									'filter',			// attribute
									'url(#text-bg)'		// value
								);

								// -- insert the text
								areaDataLabelText.innerHTML = item;

								// -- add into the group
								areaDataLabels.appendChild(
									areaDataLabelText
								);

								// add the poly points
								areaPoints += `${ 100 / areaTotalPoints * i} ${areaPointAsPercent}, `;

							});

							// add the last two points
							// -- this blocks it off
							areaPoints += '100 100, 0 100';

							// add the points to the polygon
							areaDataPolygon.setAttributeNS(
								'charty',				// namespace
								'points',				// attribute
								areaPoints				// value
							);

							// add the fill colour
							areaDataPolygon.setAttributeNS(
								'charty',				// namespace
								'fill',					// attribute
								chartyColours[ index ]	// value
							);

							// add the class to the data-item
							areaDataItem.setAttributeNS(
								'charty',				// namespace
								'class',				// attribute
								'data-item'				// value
							);

							// add the class to the data-item
							areaDataLabels.setAttributeNS(
								'charty',				// namespace
								'class',				// attribute
								'data-text'				// value
							);

							// add it into the group
							areaDataItem.appendChild( areaDataPolygon );

							// -- show labels
							if( chartyJSONOptionsNumbers ) {
								areaDataItem.appendChild( areaDataLabels );
							}

							group.appendChild( areaDataItem );

							// if there is a legend
							if( chartyJSONOptionsLegend ) {
								legend.innerHTML += `<label><span style="background: ${chartyColours[ index ]};"></span>${data.label}</label>`;
							}

						});

						break;



					// charty-pie
					// charty-donut
					// charty-section
					case 'pie'			:
					case 'donut'		:
					case 'section'		:

						// get the sum of all values
						const	circleDataSum = chartyJSONDataNumbers[0].sum,

						// create the cut out hole
						donutHoleMask = `<mask id="donut-hole"><rect width="100" height="100" fill="white" /><circle cx="50" cy="50"/></mask>`;

						// starting total percentage
						let circleSliceTotalPercent	= 0;

						// loop through all the charty data lines
						chartyJSONData.forEach( ( data, index ) => {

							// config: value as a percentage
							const circleDataPercent = ( chartyType === 'section' ?
								( data.value ) :
								( data.value / circleDataSum )
							),

							// data-item
							circleDataItem = document.createElementNS(
								chartySVGw3,			// attribute
								'g'						// value
							),

							// config: value numbers
							// -- show values
							circleDataNumber = ( chartyJSONOptionsNumbers ?

								// -- is there a value
								chartyJSONData[ index ].value ?

									// -- leave sectional values
									chartyType === 'section' ?

						 				// output the value as percentage
						 				` (${ (data.value * 100) .toFixed(2) }%)` :

						 				// output the value as is
						 				` (${ data.value.toLocaleString()} - ${ (circleDataPercent * 100).toFixed(2) }%)` :

									// catch-all
									null
								:

								// catch-all
								''
							);

							// find the start of the arc points
							const [circleArcX1, circleArcY1] = getCoordinatesFromPercent(
								circleSliceTotalPercent
							);

							// each slice starts where the last slice ended
							// -- so keep a cumulative percent
							// -- section uses raw values
							// -- others use converted percent
							circleSliceTotalPercent += circleDataPercent;

							// find the end of the arc points
							const [circleArcX2, circleArcY2] = getCoordinatesFromPercent(
								circleSliceTotalPercent
							);

							// if the slice is more than 50%
							// take the large arc (the long way around)
							const largeArcFlag = (
								circleDataPercent > 0.5 ? 1 : 0
							);

							// create an array
							// -- join it just for code readability
							const circleSlicePathData = [

								// move pen to these starting co-ordinates
								`M ${circleArcX1} ${circleArcY1}`,

								// draw an arc
								// -- radius radius x-rotate
								// -- is it a large arc // > 50%
								// -- sweep is 1
								// -- stop drawing at these end co-ordinates
								`A 50 50 0 ${largeArcFlag} 1 ${circleArcX2} ${circleArcY2}`,

								//  draw a line back to 50, 50
								`L 50 50`
							].join(' ');

							// create a path
							const circleSlicePath = document.createElementNS(
								chartySVGw3,			// attribute
								'path'					// value
							);

							// add the path points
							circleSlicePath.setAttributeNS(
								'charty',				// namespace
								'd',					// attribute
								circleSlicePathData		// value
							);

							// the slice fill colour
							circleSlicePath.setAttributeNS(
								'charty',				// namespace
								'fill',					// attribute
								chartyColours[ index ]	// value
							);

							// add the class to the data-item
							circleDataItem.setAttributeNS(
								'charty',				// namespace
								'class',				// attribute
								'data-item'				// value
							);

							// add it into the data-item
							circleDataItem.appendChild( circleSlicePath );

							// if there is a legend
							if( chartyJSONOptionsLegend ) {

								const circleDataLabel = (
									chartyJSONOptionsLabel ?
										data.label : ''
								);

								// add the data
								legend.innerHTML += `<label>
									<span style="background:${ chartyColours[ index ]};"></span>${ circleDataLabel } ${ circleDataNumber }</label>`;
							}

							// add it into the group-container
							group.appendChild( circleDataItem );

						});

						// add the donut hole
						if( chartyType === 'donut' ) {

							// insert the hole mask
							defs.innerHTML += donutHoleMask;

							// add the mask attribute
							group.setAttributeNS(
								'charty',				// namespace
								'mask',					// attribute
								'url(#donut-hole)'		// value
							);
						}

						break;



					// charty-rings
					case 'ring'		:

						const 	ringWidth = ( 32 / chartyJSONData.length),
								ringRadius = 50;

						// loop through all the charty data lines
						chartyJSONData.forEach( ( data, index ) => {

							// data-item
							const ringDataItem = document.createElementNS(
								chartySVGw3,			// attribute
								'g'						// value
							),

							// background element
							ringDataItemBG = document.createElementNS(
								chartySVGw3,			// attribute
								'circle'				// value
							),

							// foreground element
							ringDataItemFG = document.createElementNS(
								chartySVGw3,			// attribute
								'circle'				// value
							),

							// how thick based on total values
							ringStrokeWidth = (
								ringRadius - ( ( (3 * index) + 1) * ringWidth / 2 )
							),

							// get the value percentage
							ringPercent = (

								// use raw value if
								(
									// value is between 0 and 1
									( data.value >= 0 && data.value <= 1 ) &&

									// the sum of the values is less than count
									// -- if each were weighted at 1.00
									( chartyJSONDataNumbers[0].sum <= ( chartyJSONData.length * 1 ) )

								) ?

									// is a percentage
									data.value :

								(
									// value is between 0 and 100
									( data.value >= 0 && data.value <= 100 ) &&

									// the sum of the values is less than count
									// -- if each were weighted at 100
									( chartyJSONDataNumbers[0].sum <= ( chartyJSONData.length * 100 ) )

								) ?

									// convert to a percentage
									data.value / 100 :

								// all other values exit
								null
							);


							// add the data-item class
							ringDataItem.setAttributeNS(
								'charty',				// namespace
								'class',				// attribute
								'data-item'				// value
							);

							// background elements
							ringDataItemBG.setAttributeNS(
								'charty',				// namespace
								'class',				// attribute
								'ring-bg'				// value
							);
							ringDataItemBG.setAttributeNS(
								'charty',				// namespace
								'cx',					// attribute
								'50'					// value
							);
							ringDataItemBG.setAttributeNS(
								'charty',				// namespace
								'cy',					// attribute
								'50'					// value
							);
							ringDataItemBG.setAttributeNS(
								'charty',				// namespace
								'stroke-width',			// attribute
								`${ringWidth}`			// value
							);
							ringDataItemBG.setAttributeNS(
								'charty',				// namespace
								'r',					// attribute
								`${ringStrokeWidth}`	// value
							);


							// foreground elements
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'cx',					// attribute
								'50'					// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'cy',					// attribute
								'50'					// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'stroke',				// attribute
								`${chartyColours[ index ]}`	// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'fill',					// attribute
								'none'					// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'stroke-width',			// attribute
								`${ringWidth}`			// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'r',					// attribute
								`${ringStrokeWidth}`	// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'stroke-dasharray',		// attribute
								`${ ( 2 * Math.PI * ringStrokeWidth ) }
								 ${ ( 2 * Math.PI * ringStrokeWidth ) }`
								 						// value
							);
							ringDataItemFG.setAttributeNS(
								'charty',				// namespace
								'stroke-dashoffset',	// attribute
								`${
									( 2 * Math.PI * ringStrokeWidth ) -
									(ringPercent * 100) / 100 *
									( 2 * Math.PI * ringStrokeWidth )
								}`						// value
							);

							// add it into the data-item
							ringDataItem.appendChild( ringDataItemBG );
							ringDataItem.appendChild( ringDataItemFG );

							// add it into the group-container
							group.appendChild( ringDataItem );

							// if there is a legend
							if( chartyJSONOptionsLegend ) {

								const ringDataLabel = (
									chartyJSONOptionsLabel ?
										data.label : ''
								),
								ringDataValue = (
									chartyJSONOptionsNumbers ?
										` (${ ringPercent.toFixed( 2 ) * 100 }%)` : ''
								);

								// add the data
								legend.innerHTML += `<label>
									<span style="background:${chartyColours[ index ]};"></span>${ ringDataLabel }${ ringDataValue }</label>`;
							}

						});

						break;



					// charty-plot
					// charty-line
					// charty-bubble
					case 'plot'			:
					case 'line'			:
					case 'bubble'		:

						// -- data-header
						const plotDataHeader = document.createElementNS(
							chartySVGw3, 'g'
						),

						// -- data-text
						plotDataHeaderText = document.createElementNS(
							chartySVGw3, 'g'
						),

						// -- data-lines
						plotDataHeaderLine = document.createElementNS(
							chartySVGw3, 'g'
						),

						// number of [data] points
						plotNumberInDataArray = chartyJSONData.length;

						// -- data-header class
						plotDataHeader.setAttributeNS(
							'charty',
							'class',
							'data-header'
						);
						// -- data-header class
						plotDataHeaderText.setAttributeNS(
							'charty',
							'class',
							'data-text'
						);
						// -- data-header class
						plotDataHeaderLine.setAttributeNS(
							'charty',
							'class',
							'data-line'
						);

						// -- axes
						dataset.setAttributeNS(
							'charty',
							'axes-vertical',
							'Values'
						);

						// add the lines
						for( var i = 1; i <= 10; i++ ) {

							const yPos = ( (i - 1) * 10 ),

							number = ( Math.round(
								chartyJSONDataNumbers[ 0 ].largest -
								(chartyJSONDataNumbers[ 0 ].largest / 10 * (i-1)))
							);

							plotDataHeaderLine.innerHTML +=
								`<line x1="0" x2="100"
									y1="${yPos}" y2="${yPos}"
									stroke-width="0.2"
									stroke-dasharray="4,4"
								/>`;

							plotDataHeaderText.innerHTML +=
								`<text x="${ -5 }" y="${ yPos }">${ number }</text>`;
						}

						// add them to the main container
						// -- show numbers
						if( chartyJSONOptionsLabel ) {
							plotDataHeader.appendChild( plotDataHeaderText );
						}

						// -- show lines
						plotDataHeader.appendChild( plotDataHeaderLine );

						// add it into the group-container
						group.appendChild( plotDataHeader );

						// loop through all the charty data lines
						chartyJSONData.forEach( ( data, index ) => {

							// create the data-item
							const plotDataItem = document.createElementNS(
								chartySVGw3, 'g'
							),

							// create the data-text
							plotDataText = document.createElementNS(
								chartySVGw3, 'g'
							),

							// total number of points
							// -- because we're inside an array
							plotTotalPoints = (
								chartyJSONData[ index ].value.length
							),

							// scale for single or stacked
							plotCounter = (
								chartyJSONData.length > 1 ? index : 0
							),
							plotDataCount = (
								chartyJSONDataNumbers[ plotCounter ].largest
							),

							// values in the array
							plotDataPoint = chartyJSONData[ index ].value,

							// create the constants
							plotDataPolyline = document.createElementNS(
								chartySVGw3, 'polyline'
							);

							// polyline data
							let plotDataPolylinePoints = '';

							// add the data-item class
							plotDataItem.setAttributeNS(
								'charty',		// namespace
								'class',		// attribute
								'data-item'		// value
							);

							// loop the values from the data-value
							plotDataPoint.forEach( ( item, i ) => {

								// create the points
								const plotDataPointItem = document.createElementNS(
									chartySVGw3, 'circle'
								),

								// create the text item
								plotDataTextItem = document.createElementNS(
									chartySVGw3, 'text'
								),

								// x position
								plotDataPointX = (
									( ( 100 / plotTotalPoints ) * ( i+1 ) ) -
									( ( 100 / plotTotalPoints ) / 2)
								),

								// y position
								plotDataPointY = (
									100 - ( item / plotDataCount * 100 )
								),

								// adius of circle
								plotDataPointRadius = (
									chartyType === 'bubble' ?

									// normal  + 5*percentage
									(1.25 + (5 * item / chartyJSONDataNumbers[ plotCounter ].sum) ) :

									// normal
									1.25
								);

								// -- radius
								plotDataPointItem.setAttributeNS(
									'charty',	// namespace
									'r',		// attribute
									`${ plotDataPointRadius}`	// value
								);

								// -- x position
								plotDataPointItem.setAttributeNS(
									'charty',	// namespace
									'cx',		// attribute
									`${plotDataPointX}`			// value
								);

								// -- y position
								plotDataPointItem.setAttributeNS(
									'charty',	// namespace
									'cy',		// attribute
									`${plotDataPointY}`			// value
								);

								// -- fill colour
								plotDataPointItem.setAttributeNS(
									'charty',	// namespace
									'fill',		// attribute
									`${chartyColours[ index ]}`	// value
								);

								// add in the line for the graph
								if( chartyType === 'line' ) {
									// add the points to variable
									plotDataPolylinePoints += ` ${plotDataPointX} `;
									plotDataPolylinePoints += `${plotDataPointY}`;

									// set the polyline up
									plotDataPolyline.setAttributeNS(
										'charty',	// namespace
										'points',	// attribute
										`${plotDataPolylinePoints}`	// value
									);
									plotDataPolyline.setAttributeNS(
										'charty',	// namespace
										'stroke-width',	// attribute
										'0.3'	// value
									);
									plotDataPolyline.setAttributeNS(
										'charty',	// namespace
										'style',	// attribute
										`stroke: ${chartyColours[ index ]};`
													// value
									);

									// add the line to the data-item
									plotDataItem.appendChild( plotDataPolyline );
								}


								// text items
								plotDataText.setAttributeNS(
									'charty',		// namespace
									'class',		// attribute
									'data-text'		// value
								);
								plotDataTextItem.setAttributeNS(
									'charty',		// namespace
									'x',			// attribute
									`${plotDataPointX}`			// value
								);
								plotDataTextItem.setAttributeNS(
									'charty',		// namespace
									'y',			// attribute
									`${plotDataPointY - 6}`			// value
								);
								plotDataTextItem.setAttributeNS(
									'charty',		// namespace
									'filter',			// attribute
									`url(#text-bg)`			// value
								);

								// add the value to the text element
								plotDataTextItem.innerHTML = item;

								// add the text to the container
								// -- show values
								if( chartyJSONOptionsNumbers ) {
									plotDataText.appendChild(
										plotDataTextItem
									);
								}

								// add the points to the data-item
								plotDataItem.appendChild( plotDataPointItem );

							});

							// add the text container to the data-item
							plotDataItem.appendChild( plotDataText );

							// add it into the group-container
							group.appendChild( plotDataItem );

							// if there is a legend
							if( chartyJSONOptionsLegend ) {

								// add the data
								legend.innerHTML += `<label>
									<span style="background:${chartyColours[ index ]};"></span>${data.label}</label>`;
							}

						});

						break;



					case 'bar'				:
					case 'column'			:
					case 'bar-stack'		:
					case 'column-stack'		:

						//
						// constants
						//

						// -- using a column graph
						const isColumn = (
							chartyType.startsWith( 'column' ) ?
								true : false
						),

						// -- are we using a stack graph
						isStacked = (
						chartyType.endsWith( 'stack' ) ?
							true : false
						),

						// -- data-header
						barDataHeader = document.createElementNS(
							chartySVGw3,	// namespace
							'g'				// property
						),

						// -- data-header > data-label
						barDataHeaderLabel = document.createElementNS(
							chartySVGw3,	// namespace
							'g'				// property
						),

						// -- data-header > data-lines
						barDataHeaderLines = document.createElementNS(
							chartySVGw3,	// namespace
							'g'				// property
						);

						//
						// numbers
						//

						// -- count of data items
						const numberOfDataItems = ( chartyJSONData.length ),

						// -- rework the data
						// ---- get the columns
						// ---- then the sum of the columns
						chartyJSONDataColumn = chartyJSONData.map(
							( current, index, arr ) => {

							// create the blanks
							let outputArray = [],
								previousTotal = 0;

							// loop through
							for(
								let i = 0;
								i < current.value.length;
								i++
							) {

								// if it is first item
								if( i < 1 ) {

									// set the value to 0
									previousTotal = 0;

								} else {

									// add from the last value
									previousTotal +=
										arr[ i - 1 ].value[ index ];
								}

								// output the new array
								outputArray.push( previousTotal );

							}

							return outputArray;

						});

						// -- get the sum of all vertical values
						const stackIndexTotal = (
							chartyJSONData.slice( 1 ).reduce(
								( ( sums, { value } ) =>
									sums.map( ( sum, i ) =>
										sum + value[ i ] )
								), chartyJSONData[0].value
							)
						);

						//
						// attributes
						//

						// -- not for stacked
						if( !isStacked ) {

							const orientationHorizontal = (
								isColumn ? 'horizontal' : 'vertical'
							),

							orientationVertical = (
								isColumn ? 'vertical' : 'horizontal'
							);

							// -- axes
							dataset.setAttributeNS(
								'charty',			// namespace
								`axes-${ orientationHorizontal }`,
													// property
								'Values'			// value
							);
							dataset.setAttributeNS(
								'charty',			// namespace
								`axes-${orientationVertical}`,
													// property
								'Labels'			// value
							);
						}

						// -- data-header class
						barDataHeader.setAttributeNS(
							'charty',
							'class',
							'data-header'
						);

						// -- data-header > data-label class
						barDataHeaderLabel.setAttributeNS(
							'charty',				// namespace
							'class',				// property
							'data-label'			// value
						);

						// -- data-line class
						barDataHeaderLines.setAttributeNS(
							'charty',				// namespace
							'class',				// property
							'data-line'				// value
						);

						//
						// lines / labels
						//

						// -- add the lines
						// -- add the labels
						for( var i = 1; i <= 10; i++ ) {

							// -- move the labels to the bottom
							const headerLabelOffset = (
								isColumn ? 110 : 0
							),

							// -- separate the lines
							lineYPosition = ( (i - 1) * 10 ),

							// -- label text
							labelNumber = (
								!isStacked ?
									Math.round(
										chartyJSONDataNumbers[ 0 ].largest -
										( chartyJSONDataNumbers[ 0 ].largest / 10 * ( i - 1 ) )
									)

								// not stacked
								:
									100 - ( 100 / 10 * ( i - 1 ) )
							);

							// -- add: lines
							barDataHeaderLines.innerHTML +=
								`<line
									x1="0"
									x2="100"
									y1="${ lineYPosition }"
									y2="${ lineYPosition }"
									stroke-width="0.2"
									stroke-dasharray="4, 4"
								/>`;

							// -- add: lines
							barDataHeaderLabel.innerHTML +=
								`<text
									x="${ -5 + headerLabelOffset }"
									y="${ lineYPosition }">
									${ labelNumber }
								</text>`;
						}


						// the parts to the data-header
						// -- show labels
						if( chartyJSONOptionsLabel ) {
							barDataHeader.appendChild( barDataHeaderLabel );
						}

						// -- show lines
						barDataHeader.appendChild( barDataHeaderLines );

						// add it into the group-container
						group.appendChild( barDataHeader );

						//
						// main loop
						//

						// loop through all the charty data bars
						chartyJSONData.forEach( ( data, index ) => {

							//
							// constants
							//

							// -- cache wrapper
							const dataValue = (
								Array.isArray( data.value ) ?
									data.value : [ data.value ]
							),

							// sum of new array
							// -- in the columns
							chartyJSONDataColumnTotal = (
								chartyJSONDataColumn[ index ][
									( chartyJSONDataColumn[ index ].length - 1 )
								]
							),

							//
							// numbers
							//

							// -- number of [value] points
							numberInValueArray = dataValue.length,

							// -- size of the group sections
							widthOfColumn = ( 100 / numberOfDataItems ),

							// -- size of the value item
							sizeOfValue = (
								( widthOfColumn / numberInValueArray)
							),

							// -- size of the value item (half)
							sizeOfValueHalf = ( ( sizeOfValue / 2) ),

							//
							// create the elements
							//

							// -- data-item
							barDataItem = document.createElementNS(
								chartySVGw3,	// namespace
								'g'				// property
							),

							// create the data-text
							barDataText = document.createElementNS(
								chartySVGw3,	// namespace
								'g'				// property
							);

							// -- data-item
							barDataItem.setAttributeNS(
								'charty',		// namespace
								'class',		// property
								'data-item'		// value
							);

							// -- data-text
							barDataText.setAttributeNS(
								'charty',		// namespace
								'class',		// property
								'data-text'		// value
							);

							// add it into the group-container
							group.appendChild( barDataItem );

							//
							// second loop
							//

							// loop the values
							dataValue.forEach( ( item, i ) => {

								// dont label if not matching
								if( numberOfDataItems !== numberInValueArray) {
									return ( configDebug ?
										console.log( `Charty error:\n>>> The number of items in the value list does not match the number of titles` )
										: null );
								}

								// -- stacked data
								if( isStacked ) {

									// how tall is the bar in the stack
									const barDataItemPercent = (
										( item / stackIndexTotal[i] ) * 100
									),

									// how far to offset it
									barDataItemOffset = (
										( chartyJSONDataColumn[ i ][ index ] / stackIndexTotal[i] ) * 100
									);

									// bar item value
									barDataItem.innerHTML += `
										<rect
											width="${ widthOfColumn }"
											height="${ barDataItemPercent }"
											fill="${ chartyColours[ index ] }"
											x="${ ( widthOfColumn * i ) }"
											y="${ barDataItemOffset }"
										/>
									`;

									// -- show values
									if( chartyJSONOptionsNumbers ) {
										barDataText.innerHTML +=
											`<text filter="url(#text-bg)" y="${ barDataItemOffset + ( barDataItemPercent / 2 ) }" x="${ ( widthOfColumn / 2 ) + ( i *  widthOfColumn ) }">${ item }</text>`;
									}

								// -- normal data
								} else {

									// largest
									const largestValue = (
										chartyJSONDataNumbers[ index ].largest
									),

									// how tall is the bar
									barDataItemPercent = (
										item / largestValue * 100
									),

									// how far to offset the bar
									barDataItemOffset = (
										100 - barDataItemPercent
									);

									// bar item value
									barDataItem.innerHTML += `
									<rect
										width="${sizeOfValue}"
										height="${ barDataItemPercent }"
										fill="${ chartyColours[ index ] }"
										x="${(sizeOfValue * index) + (widthOfColumn * i)}"
										y="${ barDataItemOffset }"
									/>
									`;

									// add in the footer label text
									barDataHeaderLabel.innerHTML +=
										`<text
											y="${ 105 }"
											x="${ ( sizeOfValue * index ) + ( widthOfColumn * i ) + sizeOfValueHalf } ">
											${ data.label }
										</text>`;

									// add in the hover text
									// -- show values
									if( chartyJSONOptionsNumbers ) {
										barDataText.innerHTML +=
											`<text filter="url(#text-bg)" y="${ 100 - barDataItemPercent }" x="${ ( sizeOfValue * index ) + ( widthOfColumn * i ) + sizeOfValueHalf }">${ item }</text>`;
									}
								}

							});

							// if there is a legend
							if( chartyJSONOptionsLegend ) {

								// add the data
								legend.innerHTML += (
									`<label><span style="background:${chartyColours[ index ]};"></span>${data.label}</label>`
								);
							}

							// add the text into the data-item
							barDataItem.appendChild( barDataText );

						});

						break;



					case 'rating' :

						// constants
						const ratingMaxValue = chartyJSONDataNumbers[0].max;

						// loop through all the charty rating items
						chartyJSONData.forEach( ( data, index ) => {

							// constansts
							// -- data-item
							const ratingDataItem = document.createElement(
								'div'
							),

							// -- data-item rating-label
							ratingDataItemLabel = document.createElement(
								'div'
							),

							// -- data-item rating-value
							ratingDataItemValue = document.createElement(
								'div'
							),

							// -- data-item rating-bar-container
							ratingDataItemBarContainer = document.createElement(
								'div'
							),

							// -- data-item rating-bar-colour
							ratingDataItemBarColour = document.createElement(
								'div'
							),

							// calculate percentage of bar
							ratingDataItemBarColourSize = (
								( data.value / ratingMaxValue ) * 100
							);


							// add the class
							ratingDataItem.setAttribute(
								'class',		// property
								'data-item'		// value
							);

							ratingDataItemLabel.setAttribute(
								'class',		// property
								'rating-label'	// value
							);

							ratingDataItemValue.setAttribute(
								'class',		// property
								'rating-value'	// value
							);

							ratingDataItemBarContainer.setAttribute(
								'class',		// property
								'rating-bar-container'
												// value
							);

							ratingDataItemBarColour.setAttribute(
								'class',		// property
								'rating-bar-colour'
												// value
							);


							// add the data
							ratingDataItemLabel.innerHTML = data.label;
							ratingDataItemValue.innerHTML = data.value;

							ratingDataItemBarColour.setAttribute(
								'style',		// property
								`width: ${ ratingDataItemBarColourSize }%; background-color: ${ chartyColours[ index ] };`
												// value
							);


							// add to the rating data-item
							// -- show labels
							if( chartyJSONOptionsLabel ) {
								ratingDataItem.appendChild(
									ratingDataItemLabel
								);
							}

							// -- show values
							if( chartyJSONOptionsNumbers ) {
								ratingDataItem.appendChild(
									ratingDataItemValue
								);
							}

							// -- bar data
							ratingDataItem.appendChild(
								ratingDataItemBarContainer
							);
							ratingDataItemBarContainer.appendChild(
								ratingDataItemBarColour
							);

							// add it into the dom
							dataset.appendChild( ratingDataItem );

						});

						// footer notice
						dataset.innerHTML += `<small><em>Ratings are out of a total of <strong>${ ratingMaxValue }</strong></em></small>`;

						break;



					// no results
					default :
						return;
						break;

				}


				// add the generated chart
				charty = flexbox.outerHTML;



				//
				// MARK: build the charts
				//

				// check before changing DOM
				if( charty ) {

					// TODO: add link anchor
					// TODO: add figure numbering

					// add the header (if present)
					chartyHeader =	(
						( chartyJSON.title === '' || !chartyJSON.title ) ?
							'' :
							`<h3>${chartyJSON.title}</h3>` );

					// add the caption (if present)
					chartyCaption =	(
						( chartyJSON.caption === '' || !chartyJSON.caption ) ?
							'' :
							`<figcaption>${chartyJSON.caption}</figcaption>` );

					// fix spacing on header or caption not entered
					const chartyHeading = ( (chartyHeader || chartyCaption) ?
						`<header>${chartyHeader}${chartyCaption}</header>` :
						''
					);

					// add in the bars
					replacement.innerHTML = `${chartyHeading}${charty}`;

					// commit the manipulation
					element.parentNode.replaceChild( replacement, element );

				} else {

					// exit if no changes
					return;
				}

			}
		);

		// docsify return data
		next( htmlElement.innerHTML );

	});





	//
	// MARK: - after the parsing has completed
	//
	hook.doneEach(function() {

		// get all the charty items
		const docsifyCharty = document.querySelectorAll( '.docsify-charty' );

		// loop through them
		docsifyCharty.forEach( ( item, i ) => {

			// get the parts

			// --
			const docsifyChartyDataItems =
				[...item.getElementsByClassName('data-item')];

			// -- labels
			const docsifyChartyDataLabels =
				[...item.getElementsByTagName('label')];



			// loop through the labels
			docsifyChartyDataLabels.forEach( ( el, index ) => {

				// hover:
				el.addEventListener('mouseover', e => {

					item.classList.add( 'hover' );

					//
					docsifyChartyDataItems.forEach( ( dataItem, index2 ) => {

						if( index === index2 ) {
							dataItem.classList.add( 'active' );
						} else {
							dataItem.classList.remove('active');
						}

					});

				});

				//  hover: off
				el.addEventListener('mouseout', e => {

					// remove the class
					item.classList.remove( 'hover' );

					docsifyChartyDataItems.forEach( r =>
						r.classList.remove('active')
					);

				});

			});

		});

	});

}


// docsify plugin options
window.$docsify.charty = Object.assign(
							chartyOptions,
							window.$docsify.charty
						);
window.$docsify.plugins = [].concat(
							charty,
							window.$docsify.plugins
						);
