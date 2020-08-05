const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: './config.env'} );
const express = require('express');
const morgan = require('morgan');


const port = process.env.PORT || 3000;
const app = express();
app.use( express.json() ); 						// enable req.body
app.use( morgan('dev') );
// // set Templete Engine
// app.set('view engine', 'pug');
// app.set('views', './views');
// // set Static Path
// app.use( express.static( path.resolve(__dirname, 'public') ) );

app.use((req, res, next) => {
	console.log( new Date().toUTCString() );
	next();
});

let file = path.resolve(__dirname, 'public/files/users.json');
let tours = JSON.parse(fs.readFileSync( file, 'utf8') );

let getAllTours = (req,res) => {
	res.status(200).json({
		status : 'success',
		count : tours.length,
		data : {
			tours
		}
	});
};

let getTour = (req, res) => {
	let lastIndex = req.params.id - 1;
	if( lastIndex < tours.length ) {
		res.status(200).json({
			status 	: 'success',
			data 		: tours[lastIndex]
		});
	} else {
		res.status(200).json({
			status 	: 'default',
			data 		: tours[0]
		});
	}
};

let createTour = (req,res) => {
	let lastIndex = tours[tours.length - 1].id + 1;
	let newTour = Object.assign({id: lastIndex}, req.body );
	tours.push(newTour);

	fs.writeFile(file, JSON.stringify(tours), (err) => {
		res.status(201).json({
			status: 'success',
			message: 'done'
		});
	});
};

let updateTour = (req, res) => {
	let lastIndex = req.params.id - 1;

	if( lastIndex < tours.length ) {
		res.status(201).json({
			status 	: 'success',
			// just show updated value, not modify json file
			data 		: Object.assign(tours[lastIndex], req.body)	})
	} else {
		res.status(404).json({
			status 	: 'fail'
		});
	}
};

let deleteTour = (req, res) => {
	let lastIndex = req.params.id -1;
	if( lastIndex < tours.length ) {
		res.status(204).json({
			status: 'success',
			data 	: null
		});
	} else {
		res.status(404).json({
			status 	: 'fail'
		});
	}
};

app.route('/api/v1/tours')
	.get(getAllTours)
	.post(createTour);

app.route('/api/v1/tours/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);


// Default page
app.all( '*', (req, res) => {
	res.send(`Default Page : ${req.url}`)
});
app.listen(port, () => console.log(`Server Running on Port : ${port}`) );


