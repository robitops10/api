// vim highlight current word
const userModel = require('./../models/userModel');
const APIFeatures = require('./../asset/APIFeatures');
const catchAsyncFunc  = require('./../asset/catchAsyncFunc');
const ErrorHandler  = require('./../asset/ErrorHandler');


exports.getAllUsers = catchAsyncFunc( async (req, res, next) => {
	const features = new APIFeatures( userModel.find(), req.query );
	features.filter().sort().projection().pagination();
	let query = features.query; 			// (Access Class Properties)
	let users = await query; 					// make Request to Server & wait for response.


	res.status(200).json({
		status 	: 'success',
		count 	: users.length,
		data 		: users
	});
});

exports.getUser = catchAsyncFunc( async (req, res, next) => {
	let user = await userModel.findById(req.params.id);

	if(!user) {
		return next( new ErrorHandler('User not found', 404) );
	}

	res.status(200).json({
		status 	: 'success',
		data 		: user
	});
});

exports.createUser = catchAsyncFunc( async (req, res, next) => {
	let newUser = await userModel.create(req.body);
	res.status(201).json({
		status	: 'success',
		data 		: newUser
	});
});

exports.updateUser = catchAsyncFunc( async (req, res, next) => {
	let user =	await userModel.findByIdAndUpdate(req.params.id, req.body, {
		new : true,  									// Return modified Query
		runValidators: true
	});

	if(!user) {
		return next( new ErrorHandler('User not found', 404) );
	}

	res.status(201).json({
		status 	: 'success',
		data 		: user
	});
});

exports.deleteUser = catchAsyncFunc( async (req, res, next) => {
	let user = await userModel.findByIdAndDelete(req.params.id);

	if(!user) {
		return next( new ErrorHandler('User not found', 404) );
	}

	res.status(204).json({
		status : 'success',
		data : user
	});
});


// this 3 fields pass to next middleware which is 	getAllUsers(),
// this middleware act as user pass this 3 fiels: 	/?sort='-age,name&limit=5&fields=name,age,gender,eyeColor,-_id'
exports.top5documents = (req, res, next) => {
	req.query.sort = '-age name'; 												// We have to pass as it required <space> seperated
	req.query.limit = '5'; 																// If pass as url comma seperated then it will not work
	req.query.fields = 'name age gender eyeColor -_id'; 	// Remember how we handle if exits then check.
	next();
};

/*
exports.getAllUsers = async (req,res) => {
	try {

		const features = new APIFeatures(userModel.find(), req.query );
		features.filter().sort().projection().pagination();

		// 3) Finally APIFeatures.prototype.query == features.query
		let query = features.query; 			// (Access Class Properties)
		let users = await query; 					// make Request to Server & wait for response.


		res.status(200).json({
			status 	: 'success',
			count 	: users.length,
			data 		: users
		});

	} catch(err) {
		res.status(404).json({
			status : 'fail',
			message : err
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		// let user = await userModel.findOne();
		let user = await userModel.findById(req.params.id);
		// let user = await userModel.find({'_id': req.params.id});

		res.status(200).json({
			status 	: 'success',
			data 		: user
		});

	} catch(err) {
		res.status(404).json({
			status : 'fail',
			message : err
		});
	}
};
exports.createUser = async (req,res) => {
	try {
		let newUser = await userModel.create(req.body);

		res.status(201).json({
			status	: 'success',
			data 		: newUser
		});
	} catch(err) {
		res.status(404).json({
			status 	: 'fail',
			message : err
		});
	}
};

exports.updateUser = async (req, res) => {

	try {
		let user =	await userModel.findByIdAndUpdate(req.params.id, req.body, {
			new : true,  									// Return modified Query
			runValidators: true
		});

		res.status(201).json({
			status 	: 'success',
			data 		: user
		});
	} catch(err) {
		res.status(404).json({
			status 	: 'fail',
			data 		: err
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		let user = await userModel.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status : 'success',
			data : user
		});
	} catch(err) {
		res.status(404).json({
			status : 'fail',
			data : err
		});
	}
};


// this 3 fields pass to next middleware which is 	getAllUsers(),
// this middleware act as user pass this 3 fiels: 	/?sort='-age,name&limit=5&fields=name,age,gender,eyeColor,-_id'
exports.top5documents = (req, res, next) => {
	req.query.sort = '-age name'; 												// We have to pass as it required <space> seperated
	req.query.limit = '5'; 																// If pass as url comma seperated then it will not work
	req.query.fields = 'name age gender eyeColor -_id'; 	// Remember how we handle if exits then check.
	next();
};

*/






