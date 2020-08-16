const tourModel = require('./../models/tourModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const ErrorHandler = require('./../asset/ErrorHandler');



exports.getAllTours = catchAsyncFunc( async(req, res) => {
	let tour = tourModel.find();
	tour = await tour.sort({_id: -1});

	res.status(200).json({
		status: 'success',
		count: tour.length,
		data: {tour}
	});
});

exports.getTour = catchAsyncFunc(async (req, res, next) => {
	let tour = await tourModel.findById(req.params.id);
	if( !tour ) {
		return next( new ErrorHandler('This is modified ID', 200));
	}
	res.status(200).json({
		status: 'success',
		data: {tour}
	});
});

exports.createTour = catchAsyncFunc(async (req, res, next) => {
	const tour = await tourModel.create([req.body]);
	res.status(201).json({
		status: 'success',
		data: {tour}
	});
});

exports.updateTour = catchAsyncFunc(async (req, res, next) => {
	const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if( !tour ) {
		return next( new ErrorHandler('No User found to update.', 404));
	}

	res.status(201).json({
		status: 'success',
		data: {tour}
	});
});

exports.deleteTour = catchAsyncFunc(async (req, res, next) => {
	const tour = await tourModel.findByIdAndDelete(req.params.id);

	if(!tour) {
		return next( new ErrorHandler('Opps!!!. User not found.', 404));
	}

	res.status(204).json({
		status: 'success',
		data 	: {tour}
	});

});





/*
** For File manupulation


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
			data 	: 'delete operation is success, but not programed to delete by Riaz.'
		});
	} else {
		res.status(404).json({
			status 	: 'fail'
		});
	}
};

*/
