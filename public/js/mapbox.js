// 'use strict'


// const li = document.querySelector('ul li');
// console.log( li.innerText );

	console.log('ok');
	// Disable CSP (content Security Policy)	: Firefox: about:config 	> security.csp.enable 	=> false
	mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXRvcHMxMCIsImEiOiJja2VqcmF5eXQxYW5nMzFxYmRwZzdybzZtIn0.2z48RDyb7qnDqz_yT-GLlg';
	var map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
	    center: [-74.5, 40], // starting position [lng, lat]
	    zoom: 9 // starting zoom
	});

