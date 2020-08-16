const { promisify } = require('util'); 								// built-in
const jwt = require('jsonwebtoken');
const loginModel = require('./../models/loginModel');
const catchAsyncFunc  = require('./../asset/catchAsyncFunc');
const ErrorHandler  = require('./../asset/ErrorHandler');

const signToken = (id) => {
	return jwt.sign(
		{id}, 																// Auto converted to Javascript's String.
		process.env.JWT_SECRET,
		{ expiresIn : process.env.JWT_EXPIRES_IN } 		// pass in object otherwise throw errors.
	);
};

exports.signup = catchAsyncFunc( async (req, res, next) => {
	const logins = await loginModel.create({
		name : req.body.name,
		role : req.body.role,
		email : req.body.email,
		password : req.body.password,
		confirmPassword : req.body.confirmPassword,
		passwordChangedAt : req.body.passwordChangedAt
	});

	const token = signToken(logins._id);

	res.status(200).json({
		status: 'success',
		token,
		data : logins
	});
});

exports.login = catchAsyncFunc( async (req, res, next) => {
	const { email, password } = req.body;

	// 1. Check email & password exists
	if( !email || !password ) {
		return next( new ErrorHandler('Please provide email and password', 400) );
	}

	// 2. Check user exist by email & password is correct
	const user = await loginModel.findOne({ email }).select('+password');
	let checkPassword = false;

	if( user ) {
		checkPassword = await user.correctPassword(password, user.password);
	}
	if( !user || !checkPassword ) {
		return next( new ErrorHandler('Email or Password is not correct', 401) 	);
	}

	// 3. every this is Ok & send token to client.
	const token = signToken( user._id );
	res.status(200).json({
		status : 'success',
		token
	});
});


// 1) Authentication
exports.protect = catchAsyncFunc( async (req, res, next) => {
	// 1) Get Token
	let token = req.headers.authorization;
	if( token && token.startsWith('Bearer') ) {
		token =  token.split(' ')[1];
	}
	if( !token ) {
		return next( new ErrorHandler('You are not loged in, Please login first !!!', 401) );
	}


	// 2) Verification Token
	const verify = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check user still exists, after giving token
	const freshUser = await loginModel.findById(verify.id);
	if( !freshUser ) {
		return next( new ErrorHandler('User id deleted, Please Login first.', 401) );
	}

	// 4) Check is password change after supply token
	const isChanged = freshUser.isPasswordChanged(verify.iat);
	if( isChanged ) {
		return next( new ErrorHandler('Password is recently changed, please login again.', 401));
	}

	// If Everything is fine then pass this middleware.
	req.user = freshUser;
	next();
});

// 2) Authorization
exports.restrictTo = ( ...roles ) => {
	return catchAsyncFunc( async (req, res, next) => {
		// roles = ['admin', 'lead-guide']
		/* how req.user.role fomes from ???
		** - Well, req.user == user that exist's in database
		** - Which we passed after Authentication middleware
		** - That user have
		** 		. user 	:	name
		** 		. email : email
		** 		. pass 	: <hidden>
		** 		. role 	: user 				[ Default ] thats is our target.
		** 		. changePasswordAt 	: (optional)
		*/
		if( !roles.includes(req.user.role) ) {
			return next( new ErrorHandler('You Don\'t have permission to perform this action.', 403) );
		}

		next();
	});
};



/*
 *  Regular Users CRUD Operations
 */

exports.getAllLogins = catchAsyncFunc(async (req, res, next) => {
	const logins = await loginModel.find();
	res.status(200).json({
		status: 'success',
		count : logins.length,
		data : logins
	});
});

exports.getLogin = catchAsyncFunc(async (req, res, next) => {
	const logins = await loginModel.findById(req.params.id);
	if( !logins ) {
		return next(new ErrorHandler(' User Not Found. ', 404));
	}

	res.status(200).json({
		status: 'success',
		data : logins
	});
});

exports.createLogin = catchAsyncFunc(async (req, res, next) => {
		// const logins = await loginModel.create(req.body);
		const logins = await loginModel.create({
			user : req.body.user,
			email : req.body.email,
			password : req.body.password,
			confirmPassword : req.body.confirmPassword
		});

		const token = JWT.sign(
			{id : logins._id}, 										// get by mongoDB's
			process.env.JWT_SECRET,	 							// Secret value save on .env file
			process.env.JWT_EXPIRES_IN	 					// (Optional) set expire date
	 	);

		console.log( req.body.photo);
		res.status(200).json({
			status: 'success',
			token : token, 												// Send token to user
			data : logins
		});
});

exports.updateLogin = catchAsyncFunc(async (req, res, next) => {
	const logins = await loginModel.findByIdAndUpdate(req.params.id, req.body, {
		new : true,
		runValidators : true
	});
	res.status(200).json({
		status: 'success',
		data : logins
	});
});

exports.deleteLogin = catchAsyncFunc(async (req, res, next) => {
	const logins = await loginModel.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: 'success',
		data : logins
	});
});



