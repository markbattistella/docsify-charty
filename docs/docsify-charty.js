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




	// find the arc co-ordinates
	// TODO: change percent to variable
	function getCoordinatesForPercent( value ) {
		const	x = Math.cos(2 * Math.PI * value),
				y = Math.sin(2 * Math.PI * value);

		return [x, y];
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
		htmlElement.querySelectorAll('pre[data-lang=charty]').forEach(

			// what to do
			function( element ) {

				// create the variables

					// <div> to replace the <pre>
				let replacement		= document.createElement('div'),

					// blank the rest of the options
					charty			= '', // full container
					chartyHeader	= '', // header of chart
					chartyData		= '', // the inner data

					// data customisations
					dataColor,
					dataLabel,
					dataNumber,
					dataSize;

				// add in the contents
				replacement.textContent = element.textContent;

				// create the json data
				const	jsonData		= JSON.parse( replacement.innerHTML ),
						jsonConfig		= jsonData.config,
						dataArray		= jsonData.data,

						chartyType		=	jsonConfig.type ?
												`charty-${jsonConfig.type}` :
												null,

						chartyColor		=	jsonConfig.color ?
												jsonConfig.color :
												'',

						chartyLabel		=	jsonConfig.labels ?
												jsonConfig.labels :
												true,

						chartyNumbers	=	jsonConfig.numbers ?
												jsonConfig.numbers :
												false;

				// add the class
				replacement.classList.add( 'charty' );

				// set the type attribute
				replacement.setAttribute( 'type', chartyType );


				//
				// MARK: - switch the type
				//
				switch( chartyType ) {


					// normal pie chart via svg
					case 'charty-pie' :
						break;



					// pie chart with middle out
					case 'charty-donut' :
						break;



					// pie chart not whole
					case 'charty-section' :

						// create some variables
						let totalPercent = 0;

						const	xmlns	= 'http://www.w3.org/2000/svg',
								svg		= document.createElementNS(
											xmlns,
											'svg'
										);

						// attribute for sizing based off css
						svg.setAttributeNS( null, 'viewBox', '-1 -1 2 2' );
						svg.style.transform = 'rotate(-90deg)';


						// loop through each data object
						dataArray.forEach( data => {

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
							const path = document.createElementNS(
											xmlns,
											'path'
										);

							// add the attributes
							path.setAttribute( 'd', pathData );
							path.setAttribute( 'fill', data.color );

							// append it to the svg element
							svg.appendChild( path );
						});

						// check if total percent is more than 100%
						charty =	( totalPercent <= 1 ?
										svg.outerHTML :
										null
									);

						break;



					// bar chart
					case 'charty-bar' :

						// loop through each data object
						dataArray.forEach( data => {

							// config: colour - global
							dataColor	= chartyColor ?
											data.color ?
												`background:${data.color};`  :
												`background:${chartyColor};` :
											'';

							// config: base label
							dataLabel	= chartyLabel ?
											`data-label="${data.label}"`	:
											'';

							// config: top numbers
							dataNumber	= chartyNumbers ?
											`data-number="${data.value}"`	:
											'';

							// config: bar height
							dataSize 	= `grid-row-start: calc( 100 - ${data.value} );`

							// build the data
							chartyData += `<div class="data" style="${dataSize} ${dataColor}" ${dataLabel} ${dataNumber}></div>`;
						});


						// assembly
						charty =	`<div class="data-set">${chartyData}</div>`;

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
