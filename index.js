const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');
const loginRouter = require('./route/loginRouter');
const reviewRoute = require('./route/reviewRoute');

const ErrorHandler = require('./asset/ErrorHandler');
const errorController = require('./controllers/errorController');

const app = express();



const limiterObject = {
	max  			: 100, 										// Check by 5 time, so that it works
	windowMs 	: 1000 * 60 * 60,
	message 	: 'Message Send 1000 per Hours from this IP'
};
const myMiddlewareForTest = (req, res, next) => {
	console.log( new Date().toUTCString() );
	next();
};

//------------------[ Global Middleware ]----------------------
app.use( helmet() ); 														// Add HTTP Security Headers
app.use('/api', rateLimit(limiterObject) ); 		// apply on full API Route	 (limit Request per IP )
app.use( express.json( { limit: '2kb' }) ); 		// enable req.body Object  & limit Body Data for Security
app.use( mongoSanitize() ); 										// Disable NoSQL Injections by removing $ which is mongoDB's Operator
app.use( xssClean() ); 													// Clean Malicious Code, same as htmlEnteties() function in PHP
app.use( hpp( { whitelist: ['duration']}) ); 		// Remove Duplicate params's name, except those exist in whitelist array
// app.use( myMiddlewareForTest ); 							// My Custom Middleware

// if( process.env.NODE_ENV == 'development' ) {
// 	app.use( morgan('dev') ); 											// Show some logs, for development
// }

// // set Templete Engine
// app.set('view engine', 'pug');
// app.set('views', './views');
// // set Static Path
// app.use( express.static( path.resolve(__dirname, 'public') ) );



// routers
app.use('/api/v1/tours', tourRouter );
app.use('/api/v1/users', userRouter );
app.use('/api/v1/logins', loginRouter );
app.use('/api/v1/reviews', reviewRoute );


// app.get('/api/v1/reviews', (req, res) => {
// 	res.status(200).json({
// 		status: 'ok'
// 	})
// });



// Default page
app.all( '*', (req, res, next ) => {
	const err = new ErrorHandler('app route not found', 404);
	next(err); 																								// pass object will capture by Express Error Handler
});

app.use( errorController ); 																// Handle every Error that use next(value)

module.exports = app;


