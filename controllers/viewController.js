const tourModel = require('./../models/tourModel');
const loginModel = require('./../models/loginModel');
const catchAsyncFunc = require('./../asset/catchAsyncFunc');
const ErrorHandler = require('./../asset/ErrorHandler');
const multer = require('multer');
const sharp = require('sharp');


exports.getHome = catchAsyncFunc(async (req, res, next) => {
	res.render('base', {
		title : 'Home Page'
	});
});

exports.getOverview = catchAsyncFunc(async (req, res, next) => {
	// 1) Get Tour Data from Overview collection
	const tours = await tourModel.find();
	if( !tours ) return next( new ErrorHandler('Tour not found', 404) );

	// 2) Build this Templete

	// 3) Render this Templete
	res.render('overview', {
		title : 'Overview Page',
		tours,
		url : req.originalUrl
	});
});





exports.getTour = catchAsyncFunc(async (req, res, next) => {

	let tours = await tourModel.find().populate( { path: 'reviews' })
	if( !tours ) return next( new ErrorHandler('Tour not found', 404) );
	// tours = await tours.reviews;
	// console.log( tours );

	res.render('tour', {
		title : 'Tour Page',
		tours,
	});
});



exports.getLogin = (req, res) => {
	res.status(200).render('login', {
		title : 'Login Page'
	});
};


exports.handleLogin = (req, res) => {
	res.status(200).json({
		status: 'success',
		cookie : req.cookies 									// read From Browser's Cookie by 	'cookie-parser'

	});
	console.log( req.body );
	console.log( req.cookies );
};





//--------------------- Image manupulation -------------------


exports.me = (req, res) => {

	res.status(200).render('me', {
		title 	: 'Abount me',
		// data 		: res.locals.user
	});
};

exports.updateMe = catchAsyncFunc(async (req, res, next) => {
	const updatedUser = await loginModel.findByIdAndUpdate(req.user._id, { 	// got this user._id from protect Middleware
		photo : req.body.photo
	}, {
		new : true,
		runValidators : true
	});

	res.status(200).json({
		status: 'success',
		data 	: req.body

	});
	// console.log( req.user.photo );
	// console.log( updatedUser );
	// console.log( req.file );
});


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
	if( !file ) return next();

	if( file.mimetype.startsWith('image') ) {
		cb(null, true);
	} else {
		cb( new ErrorHandler('Only Image supported', 404), false);
	}
};
const upload = multer( {
	storage,
	fileFilter
});
exports.photoUpload = upload.single('photo'); 		// add req.file.buffer


exports.resizePhoto = catchAsyncFunc(async (req, res, next) => {
	if( !req.file.buffer ) return next();

	const path = 'public/images';
	const userId = '456abcf3';
	try{
		req.body.photo = `user-${userId}-.jpeg`; 							// same name as input(name='photo')  == schema({ photo: String })
		// req.body.photo = `user-${userId}-${Date.now()}.jpeg`; 		// Without Timestamp, can't override self

		await sharp( req.file.buffer )
			.resize(60,60)
			.toFormat('jpeg')
			.jpeg({quality: 90})
			.toFile(`${path}/${req.body.photo}`);

	} catch (err) {
		console.log(err);
	}

	next();
});
