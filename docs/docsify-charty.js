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

			// create them easier to read
			arrayID		= chartyOptionsArray[0];


	// docsify: when script starts running
	// hook.init(function() {
	// });







	hook.afterEach(function (html, next) {

		// we load the HTML inside a DOM node to allow for manipulation
		var htmlElement = document.createElement('div');

		htmlElement.innerHTML = html;

		htmlElement.querySelectorAll('pre[data-lang=charty]').forEach(
			function( element ) {

				// create a <div class="charty"> to replace the <pre>
				let replacement		= document.createElement('div'),
					chartyBars		= '',
					chartyHeader	= '',
					charty			= '',

					dataColor, dataLabel, dataNumber;

				// add in the contents
				replacement.textContent = element.textContent;

				// create the json data
				const	jsonData		= JSON.parse( replacement.innerHTML ),
						array			= jsonData.data,

						chartyType		= jsonData.config.type ?
											'charty-' + jsonData.config.type :
											null,

						chartyColor		= jsonData.config.color ?
											jsonData.config.color :
											'',

						chartyLabel		= jsonData.config.labels ?
											jsonData.config.labels :
											true,

						chartyNumbers	= jsonData.config.numbers ?
											jsonData.config.numbers :
											false;

				// add the class
				replacement.classList.add( 'charty' );

				// set the type attribute
				replacement.setAttribute( 'type', chartyType );

				// switch the type
				switch( chartyType ) {
					case 'line':
						break;

					case 'charty-bar':
						// loop through the data for output
						for( let index of array ) {

							// config: top numbers
							dataColor = chartyColor ?
											'background:' + chartyColor + ';' :
											'';

							// config: base label
							dataLabel = chartyLabel ?
											'data-label="' + index.label + '"' :
											'';

							// config: top numbers
							dataNumber = chartyNumbers ?
										'data-number="' + index.value + '"' : '';

							// loop through all the data
							// -- build the bars
							chartyBars +=	'<div class="bar" \
												style="grid-row-start: calc(100 - ' + index.value + ');' +
												dataColor + '"' +
												dataLabel + dataNumber +
												'></div>';
						}
						break;

					// exit if not matched
					default:
						return;
				}

				// add the header if present
				chartyHeader = jsonData.title === "" || !jsonData.title ?
									chartyHeader :
									'<h3>' + jsonData.title + '</h3>';

				//
				charty = chartyHeader + '<div class="bars">' + chartyBars + '</div>';

				// add in the bars
				replacement.innerHTML = charty;

				// commit the manipulation
				element.parentNode.replaceChild(replacement, element);

			}
		);

		next(htmlElement.innerHTML);

	});

}


// docsify plugin options
window.$docsify.charty = Object.assign( chartyOptions, window.$docsify.charty );
window.$docsify.plugins = [].concat(charty, window.$docsify.plugins);
