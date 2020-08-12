const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');
const ErrorHandler = require('./asset/ErrorHandler');
const errorController = require('./controllers/errorController');


const app = express();
app.use( express.json() ); 						// enable req.body


// if( process.env.NODE_ENV == 'development' ) {
// 	app.use( morgan('dev') );
// }
// // set Templete Engine
// app.set('view engine', 'pug');
// app.set('views', './views');
// // set Static Path
// app.use( express.static( path.resolve(__dirname, 'public') ) );

// app.use((req, res, next) => {
// 	console.log( new Date().toUTCString() );
// 	next();
// });


// routers
app.use('/api/v1/tours', tourRouter );
app.use('/api/v1/users', userRouter );


// Default page
app.all( '*', (req, res, next ) => {
	const err = new ErrorHandler('app route not found', 404);
	next(err); 																								// pass object will capture by Express Error Handler
});

app.use( errorController ); 																// Handle every Error that use next(value)

module.exports = app;


