const path = require('path');
const fs = require('fs');

let file = path.resolve(__dirname, './../public/files/users.json');
let tours = JSON.parse(fs.readFileSync( file, 'utf8') );


// // for check param('id', thisCallback) (1)
// exports.checkId = (req, res, next, value) => {
// 	console.log( value );
// 	let lastIndex = value - 1;
// 	if( lastIndex < tours.length ) {
// 		return res.status(200).json({
// 			status 	: 'success',
// 			data 		: tours[lastIndex]
// 		});
// 	}
// 	next();
// };



exports.checkBody = (req, res, next) => {
	if(!req.body.url || !req.body.login) {
		return res.status(404).json({
			status : 'fail',
			message : 'url or login property is missing'
		});
	}
	next();
};


exports.getAllTours = (req,res) => {
	res.status(200).json({
		status : 'success',
		count : tours.length,
		data : {
			tours
		}
	});
};

exports.getTour = (req, res) => {
	let lastindex = req.params.id - 1;
	if( lastindex < tours.length ) {
		res.status(200).json({
			status 	: 'success',
			data 		: tours[lastindex]
		});
	} else {
		res.status(200).json({
			status 	: 'default',
			data 		: tours[0]
		});
	}
};

exports.createTour = (req,res) => {
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

exports.updateTour = (req, res) => {
	let lastIndex = req.params.id - 1;

	if( lastIndex < tours.length ) {
		res.status(201).json({
			status 	: 'success',
			data 		: Object.assign(tours[lastIndex], req.body)	})
	} else {
		res.status(404).json({
			status 	: 'fail'
		});
	}
};

exports.deleteTour = (req, res) => {
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
