const crypto = require('crypto'); 				// Built-in low secruity encryption
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const loginSchema = new mongoose.Schema({
	name : {
		type: String,
		required: [true, 'Name is required']
	},
	role : {
		type 		: String,
		enum 		: {
			values 		:  ['user', 'guide', 'lead-guide', 'admin'],
			message 	: "Value must be  ['user', 'guide', 'lead-guide', 'admin']"
		},
		default : 'user'
	},
	email : {
		type: String,
		required: [true, 'email is required'],
		unique: true,
		lowercase : true,
		validate: [validator.isEmail, 'Please insert a valid Email']
	},
	photo : {
		type : String,
		Default: 'userPhoto.png'
	},
	password : {
		type 			: String,
		required 	: [true, 	'User password is required'],
		minlength : [5, 	'Minimum Length is 5 Character long'],
		maxlength : [20, 	'Maximum Length is 20 Character long'],
		select 		: false
	},
	confirmPassword : {
		type: String,
		required: [true, 'User confirm Password is required'],
		validate: { 																							// it is mongoose's validator function,
			validator : function(el) { 															// not validator package
				return el === this.password; 													// if same then true, else false == fail
			}
		}
	},
	active : {
		type: Boolean,
		default: true, 																						// active when create Account
		select : false 																						// Hide, no need to show up our acount model
	},
	passwordChangedAt : Date,
	passwordResetToken : String,
	passwordResetExpires : Date
});


loginSchema.pre( 'save', async function (next) {
	// if not modified password field then jump out from this middleware.
	if( !this.isModified('password') ) {return next() }

	this.password = await bcrypt.hash(this.password, 12); 		// more the cost, higher CPU & Security
	this.confirmPassword = undefined; 												// Remove confirmPassword
	next();
});

loginSchema.pre('save', function(next) {
	if( !this.isModified('password') || this.isNew ) {
		return next();
	}
	this.passwordChangedAt = Date.now() - 1000; 							// always it happend 1 sec before token created.
	next();
});


// keyword `this` point to current Query
loginSchema.pre(/^find/, function(next) { 									// Any type of find
	// this.find( { active : true } ); 												// show only which users have active = false
	this.find( { active : {$ne : false} } ); 									// show active=ture + active=undefined
	next();
});


// our custom function which accecable by
// Document.funName(req.body.password, 	await UserModel.readOne().select('+password') );
loginSchema.methods.correctPassword = async function (pass, hashed) {
	return await bcrypt.compare( pass, hashed );
};


loginSchema.methods.isPasswordChanged = function(jwtTimestamp) {

	if( this.passwordChangedAt ) {
		const passwordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000);

		return ( jwtTimestamp < passwordChangedAt ); 		// [ jwt=100 < change=200 	=> true == error ]
	}
	return false;
};


// add token & expires date on Database.
loginSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex'); 				// 1. Create Random String for salt.
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); 		// 2. hashed it & save
	this.passwordResetExpires = Date.now() + 10 * 1000 * 60; 					// 10s x 60 = 10m + now => 10 minute after

	// return un-hashed version only to send to user.
	// if we send encrypted version, then encryption is useless. 	( But user can guese because we send salt )
	return resetToken;
};






module.exports = mongoose.model('Login', loginSchema);
