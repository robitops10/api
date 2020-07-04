const path = require('path');
const express = require('express');
const ejs = require('ejs');

const app = express(); 														// express is a object as function

//----------[ Middleware ]-------------
let rootURL = path.resolve(__dirname, 'public');
app.use( express.static(rootURL) ); 							// Set Root Path

let viewEnging = path.resolve(__dirname, 'views');
app.set('views', viewEnging); 										// Set View Enginge's Directory
app.set('view engine', 'ejs'); 										// Set View Enginge



//----------[ Route ]-------------

app.get('/', (req, res) => { 											// if in root, index.html have then always load it.
	res.status(200).render('index', {
		title: 'Home Page',
		message: 'Welcome to Homepage',
	});
});

app.get('/about', (req, res) => {
	res.status(200).render('about', {
		title: 'About Page',
		message: 'Here Content will be abut, (about page)',
	});
});

app.get('/about/:who', (req, res) => { 						// get Request paramiter
	res.status(200).end('This is about page. ' + req.params.who);
});








//----------[ Ending ]-------------

app.use( (req, res) => { 													// if Route not defined then do this
	res.statusCode = 404;
	res.end('404 : Page Not Found');
});


app.listen(8000, () => {
	console.log('Server is Running on port: 8000');
});



