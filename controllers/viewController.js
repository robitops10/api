const tourModel = require('./../models/tourModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');


exports.getHome = catchAsyncFunc(async (req, res, next) => {
	res.render('base', {
		title : 'Home Page'
	});
});

exports.getOverview = catchAsyncFunc(async (req, res, next) => {
	// 1) Get Tour Data from Overview collection
	const tours = await tourModel.find();

	// 2) Build this Templete
	// 3) Render this Templete

	res.render('overview', {
		title : 'Overview Page',
		tours
	});
});

exports.getTour = catchAsyncFunc(async (req, res, next) => {
	res.render('tour', {
		title : 'Tour Page'
	});
});
