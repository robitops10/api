const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const ErrorHandler = require('./../asset/ErrorHandler');
const sendData = require('./../asset/sendData');
const APIFeatures = require('./../asset/APIFeatures');


// return exect function
exports.deleteOne = (model) => {
	return catchAsyncFunc(async (req, res, next) => {
		const tour = await model.findByIdAndDelete(req.params.id);

		if(!tour) { return next( new ErrorHandler('Opps!!!. User not found.', 404)) }

		sendData(res, 204, tour);
	});
}


exports.updateOne = (model) => catchAsyncFunc(async (req, res, next) => {
	const tour = await model.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if( !tour ) { return next( new ErrorHandler('No User found to update.', 404)) }

	sendData(res, 201, tour);
});


exports.createOne = model => catchAsyncFunc(async (req, res, next) => {
	const tour = await model.create([req.body]);

	sendData(res, 201, tour);
});


exports.getOne = model => catchAsyncFunc(async (req, res, next) => {
	let tour = await model.findById(req.params.id).select('-__v');

	if( !tour ) {
		return next( new ErrorHandler('This is modified ID', 200));
	}
	sendData(res, 200, tour);
});

exports.getAll = (model, populateObj) => catchAsyncFunc( async (req, res, next) => {
	// specially for review on tour
	let queryFilter = {};
	if( req.params.tourId ) queryFilter = { 'tour' : req.params.tourId };

	let queryFind = model.find( queryFilter );
	if( populateObj ) queryFind = queryFind.populate(populateObj);

	const features = new APIFeatures( queryFind, req.query );
	// const features = new APIFeatures( model.find(), req.query );
	features.filter().sort().projection().pagination();
	let query = features.query; 			// (Access Class Properties)
	let users = await query; 					// make Request to Server & wait for response.


	sendData(res, 200, users);
});

