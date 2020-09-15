const ErrorHandler = require('./../asset/ErrorHandler');


const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path} : ${err.value}`;
	return new ErrorHandler(message, 404);
};
const handleMongoErrorDB = (err) => {
	let message = err.message.match(/".*?"/)[0];
	message = `Duplicate value : ${message}. Please insert new One.`;
	return new ErrorHandler(message, 400);
};

const handleValidationErrorDB = (err) => {
	let error = Object.values(err.errors); 		// make array of all errors
	error = error.map( item => item.message.trim() );
	error = error.join(', ');

	return new ErrorHandler(error, 400);
};

const handleJsonWebTokenError = (err) => {
	return new ErrorHandler( err.message, 401);
};

const handleTokenExpiredError = (err) => {
	return new ErrorHandler( 'Your Token is expired, Please Login Again..', 401);
};


const errDev = (err, req, res) => {
	// if request from API
	if( req.originalUrl.startsWith('/api') ) {
		res.status(err.statusCode).json({
			// name : err.constructor.name, 		// self class name
			name 		: err.name, 								// overrided class name if inhereted
			message : err.message,

			status 	: err.status,
			error 	: err,
			stack 	: err.stack
		});

	} else {
	// if request from Server side Render
		res.status( err.statusCode ).render('error', {
			title 	: 'Error Page',
			msg 		: err.message
		});
	}
};

const errPro = (err, req, res) => {
	if( err.isOperational ) { 																// confirm that error handle by ErrorHandler.js
		res.status(err.statusCode).json({
			status 	: err.status,
			message : err.message 																// no need to set err.message, it is set by default.
		});
	}
};


// Express Global Error Handler with 4 argument, 1st one is err Object
// this Middleware will fire up when any middleware pass something on 	`next(Obj)`
module.exports = (err, req, res, next) => {
	err.statusCode 	= err.statusCode 	|| 500;
	err.status 			= err.status 			|| 'fail';

	if( process.env.NODE_ENV === 'development') {
		errDev(err, req, res);


		// let error = '';
		// if( err.name === 'JsonWebTokenError' )  error = handleJsonWebTokenError(err);
		// errPro(error, res); 									// only if (isOperational == true)

	} else if( process.env.NODE_ENV === 'production' ) {

		let error = '';
		// return our ErrorHandler which have err.isOperational property.
		if( err.name === 'CastError' 	)  error = handleCastErrorDB(err);
		if( err.name === 'MongoError' )  error = handleMongoErrorDB(err);
		if( err.name === 'ValidationError' )  error = handleValidationErrorDB(err);
		if( err.name === 'JsonWebTokenError' )  error = handleJsonWebTokenError(err);
		if( err.name === 'TokenExpiredError' )  error = handleTokenExpiredError(err);

		errPro(error, req, res); 									// only if (isOperational == true)

	} else { 																// if (isOperational == false) == Not handled by our Error Handler.
		res.status(err.statusCode).json({
			status 	: 'failed',
			message : 'something is very wrong'
		});

	}
};


