const { promisify } = require('util'); 								// built-in
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const loginModel = require('./../models/loginModel');
const catchAsyncFunc  = require('./../asset/catchAsyncFunc');
const ErrorHandler  = require('./../asset/ErrorHandler');
const sendEmail  = require('./../asset/email');
const sendData  = require('./../asset/sendData');
const handlerFactory = require('./handlerFactory');

const signToken = (id) => {
	return jwt.sign(
		{id}, 																// Auto converted to Javascript's String.
		process.env.JWT_SECRET,
		{ expiresIn : process.env.JWT_EXPIRES_IN } 		// pass in object otherwise throw errors.
	);
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken( user._id );

	const cookieOptions = { 												//  						x 				s 		m 		h 	d
		expires 	: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24),
		// secure 		: true, 												// only send on HTTPS connections
		httpOnly 	: true  														// Only access my Broser's HTTP methods not others way.
	};
	if( process.env.NODE_ENV === 'production' ) {
		cookieOptions.secure = true 									// only work on Production which has HTTPS protocol enabled.
	}
	// cookey 	name 	value 	options
	res.cookie('jwt', token, cookieOptions );


	res.status(statusCode).json({
		status : 'success',
		token
	});
	// return true;
};


const filterObj = (obj, ...allowedFields) => {
	// loop throw object's item & check is items exist's in allowedFields array.
	const newObj = {};

	Object.keys(obj).forEach( (el) => {
		if (allowedFields.includes(el) ) {
			newObj[el] = obj[el];
		}
	});

	return newObj;
};




exports.signup = catchAsyncFunc( async (req, res, next) => {
	const logins = await loginModel.create( req.body );
	// const logins = await loginModel.create({
	// 	name : req.body.name,
	// 	role : req.body.role,
	// 	email : req.body.email,
	// 	password : req.body.password,
	// 	confirmPassword : req.body.confirmPassword,
	// 	passwordChangedAt : req.body.passwordChangedAt,
	// 	passwordResetToken : req.body.passwordResetToken,
	// 	passwordResetExpires : req.body.passwordResetExpires
	// });

	createSendToken(logins, 200, res);
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
	createSendToken(user, 200, res);
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
		** 		. pass 	: <select: false>
		** 		. role 	: user 				[ Default ] thats is our target.
		** 		. changePasswordAt 	: (optional)
		*/
		if( !roles.includes(req.user.role) ) {
			return next( new ErrorHandler('You Don\'t have permission to perform this action.', 403) );
		}

		next();
	});
};



/* 3) Password Reset: 2 Step Process
** 		1. Going to Password Forget page
** 				. supply current email
** 		2. Going to Password Reset page
** 				. supply new password
*/

exports.forgotPassword = catchAsyncFunc( async (req, res, next) => {
	// 1) find user by email
	let user = await loginModel.findOne( { email : req.body.email });
	if( !user ) {
		return next( new ErrorHandler('Opps!!! No user by this email.', 404) );
	}
	// 2) Generate token
	const resetToken = user.createPasswordResetToken();
	user = await user.save({ validateBeforeSave: false }); 		// override Default Schema Validation

	// 3) Send token to found user
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/logins/resetPassword/${resetToken}`;
	console.log( resetToken );

	const options = {
		email : user.email,
		subject : 'Check Email within 10 minutes.',
		message : `forgot your password? then click this link ${resetURL} else simple ignore this mail.
							\nAnd this object required for sendEmail args`
	};


	try {
		await sendEmail(options); 					// Async Function that's why need await

		res.status(200).json({
			ststus: 'success',
			data: 'token sent to email'
		});
	} catch(err) {
		// if something wrong then reset every change we made
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false }); 		// override Default Schema Validation

		return next( new ErrorHandler('Ehere is Error to send email.', 500));
	}

});

exports.resetPassword = catchAsyncFunc( async (req, res, next) => {

	// 1) find user by Token (Unhashed) comes from URL, copied from MailTrap.io
	const resetToken = req.params.token; 								// in route : 	'resetPassword/:token'
	const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	// 2) check token not expires & user is exists by that token & set new password
	const user = await loginModel.findOne({
		passwordResetToken : hashedToken,
		passwordResetExpires : { $gt : Date.now() } 		// We Set Expires time for 10 minute future in forgate route
	});

	if( !user ) {
		return next( new ErrorHandler(' Opps!!!, Token is invalid or expires, please try again.'));
	}
	// 3) Update change password property
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 4) loged user == set JWT token so that user can access
	createSendToken(user, 200, res);

});


/*
** for this route require 2 things
** 1. get token 	: Authorization > Bearer > Token : {{jwt}}
** 2. set token 	: Test > pm.environment.set("jwt", pm.response.json().token);
*/
exports.updatePassword = catchAsyncFunc(async (req, res, next) => {
	// 1) Get User 	Remember we set user with protect middleware 		req.user = freshUser;
	const user = await loginModel.findById(req.user.id).select('+password');
	if( !user ) {
		return next( new ErrorHandler(' Warning !!!.. Some one change your Crediential'), 401);
	}

	// 2) Confirm this user. Check currentPassword with this user's dbPassword
	const currentPassword = req.body.password;
	if( !currentPassword ) {
		return next( new ErrorHandler('Please insert a password.', 404));
	}
	// My async Function, which require await
	const correctPassword = await user.correctPassword(currentPassword, user.password);
	if( !correctPassword ) {
		return next( new ErrorHandler('Opps!!! password or confirm password not matched.', 401));
	}

	// 3) Update Password
	user.password = req.body.password; 									// user currentPassword
	user.confirmPassword = req.body.confirmPassword; 		// user confirm current password
	await user.save(); 																	// 1. save on DB, 2. RunValidation

	/* Why we did not use 	user.findByIdAndUpdate(); 	Because of 2 Reasons.
	** 1). Schema Validation 	not work with findByIdAndUpdate()
	** 2). pre() middleware 	not work with findByIdAndUpdate()
	*/

	// 4) Allow to Login 	: As always set Token
	createSendToken(user, 201, res);
});


exports.updateMe = catchAsyncFunc( async (req, res, next) => {
	// 1) Throw Error if user POSTed password or confirmPassword
	if( req.body.password || req.body.confirmPassword ) {
		return next( new ErrorHandler('To change password use updatePassword Route'), 400 );
	}

	// 2) Filter out unwanted fields that are not allow to updated.
	const filteredBody = filterObj( req.body, 'name', 'email', 'active' ); 			// return allowed fields
	// const filteredBody = filterObj( req.body, 'name', 'email' ); 			// active to true from false 	/deleteMe

	// 3) update User Document
	/*
	** if we try to use
	** const user = await loginModel.findById(req.user._id);
	** user.save(); 		// Require all required field's validation because
	*/
	const user = await loginModel.findByIdAndUpdate(req.user._id, filteredBody, {
		new : true,
		runValidators : true
	});

	sendData(res, 201, user);
	// res.status(200).json({
	// 	status : 'success',
	// 	user
	// });
});


// delete means not Delete from Database, just 	make account inactive
// if need to delete then delete manually by Admin
exports.deleteMe = catchAsyncFunc(async (req, res, next) => {

	// once again get user from 	loginController.protect 	Middleware
	const user = await loginModel.findByIdAndUpdate(req.user._id, { active: false });

	sendData(res, 204, user);
});














exports.getMeMiddleware = (req, res, next) => {
	req.params.id = req.user._id; 		// if added protect middleware then req have user object.
	next();
};

/*
 *  Regular Users CRUD Operations
 */

exports.updateLogin = handlerFactory.updateOne(loginModel);
exports.deleteLogin = handlerFactory.deleteOne(loginModel);

exports.getMe 			= handlerFactory.getOne(loginModel);


exports.getAllLogins = catchAsyncFunc(async (req, res, next) => {
	// const logins = await loginModel.find( {active : true}); 			// here or by pre middleware
	const logins = await loginModel.find();
	if( logins.length < 1 ) {
		return next( new ErrorHandler('Opps!! there is no user.', 404));
	}
	// console.log( logins );
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
			name : req.body.name,
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


// exports.updateLogin = catchAsyncFunc(async (req, res, next) => {
// 	const logins = await loginModel.findByIdAndUpdate(req.params.id, req.body, {
// 		new : true,
// 		runValidators : true
// 	});
// 	res.status(200).json({
// 		status: 'success',
// 		data : logins
// 	});
// });

// exports.deleteLogin = catchAsyncFunc(async (req, res, next) => {
// 	const logins = await loginModel.findByIdAndDelete(req.params.id);
// 	res.status(200).json({
// 		status: 'success',
// 		data : logins
// 	});
// });



