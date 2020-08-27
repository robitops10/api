const tourModel = require('./../models/tourModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const ErrorHandler = require('./../asset/ErrorHandler');
const sendData = require('./../asset/sendData');

const handlerFactory = require('./handlerFactory');


exports.getAllTours = handlerFactory.getAll(tourModel, { path:'reviews', select:'-__v -createdAt' });
exports.getTour 		= handlerFactory.getOne(tourModel);
exports.createTour 	= handlerFactory.createOne(tourModel);
exports.updateTour 	= handlerFactory.updateOne(tourModel);
exports.deleteTour 	= handlerFactory.deleteOne(tourModel);


// exports.getAllTours = catchAsyncFunc( async(req, res) => {
// 	// let tour = tourModel.find();
// 	// tour = await tour.sort({_id: -1});

// 	// pupulate virtual field reviews in tourModel (2)
// 	// let tour = await tourModel.find().select('-__v');
// 	let tour = await tourModel.find().select('-__v').populate({
// 		path 	: 'reviews',
// 		select: '-__v -createdAt'
// 	});

// 	sendData(res, 200, tour);
// 	// res.status(200).json({
// 	// 	status: 'success',
// 	// 	count : tour.length,
// 	// 	tour
// 	// });
// });


// exports.getTour = catchAsyncFunc(async (req, res, next) => {
// 	// let tour = await tourModel.findById(req.params.id);

// 	// let tour = await tourModel.findById(req.params.id).populate('guides'); 	//	(1)	Auto embed by ID (Full Object)

// 	// let tour = await tourModel.findById(req.params.id).populate({ 						//	(2)	all but __v & passwordChangedAt
// 	// 	path: 'guides',
// 	// 	select: '-__v -passwordChangedAt'
// 	// });

// 	// 	(3) if need to multiple (all) route then use mongoose middleware, pre in tourModel
// 	// 	now every find have object seams that it is embaded.	(but it is referenced, see in Database the real fact)
// 	let tour = await tourModel.findById(req.params.id).select('-__v');

// 	if( !tour ) {
// 		return next( new ErrorHandler('This is modified ID', 200));
// 	}
// 	sendData(res, 200, tour);
// });


// exports.createTour = catchAsyncFunc(async (req, res, next) => {
// 	const tour = await tourModel.create([req.body]);

// 	sendData(res, 201, tour);
// 	// res.status(201).json({
// 	// 	status: 'success',
// 	// 	data: {tour}
// 	// });
// });

// exports.updateTour = catchAsyncFunc(async (req, res, next) => {
// 	const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 		runValidators: true
// 	});

// 	if( !tour ) {
// 		return next( new ErrorHandler('No User found to update.', 404));
// 	}

// 	sendData(res, 201, tour);
// 	// res.status(201).json({
// 	// 	status: 'success',
// 	// 	data: {tour}
// 	// });
// });


// exports.deleteTour = catchAsyncFunc(async (req, res, next) => {
// 	const tour = await tourModel.findByIdAndDelete(req.params.id);

// 	if(!tour) {
// 		return next( new ErrorHandler('Opps!!!. User not found.', 404));
// 	}

// 	sendData(res, 204, tour);
// 	// res.status(204).json({
// 	// 	status: 'success',
// 	// 	data 	: {tour}
// 	// });

// });





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
