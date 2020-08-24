const reviewModel = require('./../models/reviewModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');

exports.getReviews = catchAsyncFunc(async (req, res, next) => {
	// const review = await reviewModel.find();
	// const review = await reviewModel.find().populate('user');
	// const review = await reviewModel.find().populate('user tour');

	const review = await reviewModel.find(); 									// have pre middleware
	res.status(200).json({
		status: 'success',
		review
	});
});

exports.createReview = catchAsyncFunc(async (req, res, next) => {
	const review = await reviewModel.create([req.body]);

	res.status(201).json({
		status: 'success',
		review
	});
});

exports.deleteReview = catchAsyncFunc(async (req, res, next) => {
	const review = await reviewModel.findByIdAndDelete( req.params.id );

	res.status(201).json({
		status: 'success',
		review
	});
});

