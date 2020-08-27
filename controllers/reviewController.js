const reviewModel = require('./../models/reviewModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const sendData = require('./../asset/sendData');
const handlerFactory = require('./handlerFactory');
/*
** this Router controller can acces by 2 route
** 	1. /api/v1/review 								= without params 					: reviewRouter.js
** 	2. /api/v1/tours/:tourId/review 	= has params = tourId 	 	: tourRouter.js
*/

exports.createReviewMiddleware = (req, res, next) => {
	if( !req.body.tour ) req.body.tour = req.params.tourId;
	if( !req.body.body ) req.body.user = req.user._id;

	next();
};

exports.getAllReviews = handlerFactory.getAll(reviewModel);
exports.getReview 		= handlerFactory.getOne(reviewModel);
exports.createReview 	= handlerFactory.createOne(reviewModel);
exports.updateReview 	= handlerFactory.updateOne(reviewModel);
exports.deleteReview 	= handlerFactory.deleteOne(reviewModel);


// exports.getAllReviews = catchAsyncFunc(async (req, res, next) => {
// 	// const review = await reviewModel.find();
// 	// const review = await reviewModel.find().populate('user');
// 	// const review = await reviewModel.find().populate('user tour');

// 	// if route from /api/v1/tours/:tourId/review 	then have 	tourId 	params
// 	let filter = {};
// 	if( req.params.tourId ) filter = { 'tour' : req.params.tourId };

// 	// find( {} ) 	|| 		find({ 'tour': 'ab43f324' })
// 	const review = await reviewModel.find(filter).select('-__v'); 				// have pre middleware
// 	sendData(res, 200, review);
// 	// res.status(200).json({
// 	// 	status: 'success',
// 	// 	review
// 	// });
// });


// exports.getReview = catchAsyncFunc(async (req, res, next) => {
// 	const review = await reviewModel.findById(req.params.id);

// 	sendData(res, 200, review);
// });


// exports.createReview = catchAsyncFunc(async (req, res, next) => {
// /*
// *** 1. create review with login userId & tourId
// *** 2. This tourId will be populate as though added current tour on this Review
// */
// 	// if not pass tourId or userId on body then
// 	// get tourId from URL & userId from Login User.
// 	if( !req.body.tour ) req.body.tour = req.params.tourId;
// 	if( !req.body.body ) req.body.user = req.user._id;

// 	const review = await reviewModel.create([req.body]);

// 	sendData(res, 201, review);
// });



// exports.updateReview = catchAsyncFunc( async(req, res, next) => {
// 	// if we have this type of filtering, then put them in seperate middleware, & then
// 	// add the middleware before this function middleware, in router
// 	const review = req.body.review;
// 	const rating = req.body.rating;
// 	const body = { review, rating };
// 	const data = await reviewModel.findByIdAndUpdate( req.params.id, body, {
// 		new : true,
// 		runValidators: true
// 	});

// 	// sendData(res, 201, review);
// 	res.status(201).json({
// 		status: 'success',
// 		review : data
// 	});
// });


// exports.deleteReview = catchAsyncFunc(async (req, res, next) => {
// 	const review = await reviewModel.findByIdAndDelete( req.params.id );

// 	sendData(res, 204, review);
// 	// res.status(204).json({
// 	// 	status: 'success',
// 	// 	review
// 	// });
// });

