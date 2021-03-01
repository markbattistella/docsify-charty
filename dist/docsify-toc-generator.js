/*! docsify-toc-generator.js v0.0.1 | (c) Mark Battistella */

'use strict';

// nodejs: get plugins
var fs = require('fs');

function getTableOfContents( tableOfContentsOptions ) {

	// if it is empty
	if(

		// must have this in the config
		!tableOfContentsOptions.id

	) {
		return 'No config set'
	}

	// create the array variables
	let id		= tableOfContentsOptions.id ?
						tableOfContentsOptions.id : null;

	// build the array
	var outputArray = [
		id
	];

	return outputArray;
}

// defaults - and setup
const tableOfContentsOptions = {
	id:	''
};












// the function
function autoTOC( hook, vm ) {

	// get the variables from the cofig
	const	tableOfContentsOptionsArray = getTableOfContents(
											tableOfContentsOptions
										),

			// create them easier to read
			arrayID		= tableOfContentsOptionsArray[0];




	// docsify: when script starts running
	hook.init(function() {


		var files = fs.readdirSync('/assets/photos/');


	});


	// docsify: when to trigger the script
	hook.doneEach(function() {
	});
}


// find footer plugin options
window.$docsify.autoTOC = Object.assign(
	tableOfContentsOptions,
	window.$docsify.autoTOC
);

window.$docsify.plugins = [].concat(autoTOC, window.$docsify.plugins);
