const tourModel = require('./../models/tourModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const ErrorHandler = require('./../asset/ErrorHandler');


exports.getHome = catchAsyncFunc(async (req, res, next) => {
	res.render('base', {
		title : 'Home Page'
	});
});

exports.getOverview = catchAsyncFunc(async (req, res, next) => {
	// 1) Get Tour Data from Overview collection
	const tours = await tourModel.find();
	if( !tours ) return next( new ErrorHandler('Tour not found', 404) );

	// 2) Build this Templete

	// 3) Render this Templete
	res.render('overview', {
		title : 'Overview Page',
		tours,
		url : req.originalUrl
	});
});





exports.getTour = catchAsyncFunc(async (req, res, next) => {

	let tours = await tourModel.find().populate( { path: 'reviews' })
	if( !tours ) return next( new ErrorHandler('Tour not found', 404) );
	// tours = await tours.reviews;
	// console.log( tours );

	res.render('tour', {
		title : 'Tour Page',
		tours,
	});
});



exports.getLogin = (req, res) => {
	res.status(200).render('login', {
		title : 'Login Page'
	});
};


exports.handleLogin = (req, res) => {
	res.status(200).json({
		status: 'success',
		cookie : req.cookies 									// read From Browser's Cookie by 	'cookie-parser'

	});
	console.log( req.body );
	console.log( req.cookies );
};
