const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const loginSchema = new mongoose.Schema({
	name : {
		type: String,
		required: [true, 'Name is required']
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
	role : {
		type 		: String,
		enum 		: ['user', 'guide', 'lead-guide', 'admin'],
		default : 'user'
	},
	passwordChangedAt : {
		type 			: Date,
		// default 	: new Date()
		// required 	: true
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
	}
});


loginSchema.pre( 'save', async function (next) {
	// if not modified password field then jump out from this middleware.
	if( !this.isModified('password') ) {return next() }

	this.password = await bcrypt.hash(this.password, 12); 		// more the cost, higher CPU & Security
	this.confirmPassword = undefined; 												// Remove confirmPassword
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

module.exports = mongoose.model('logins', loginSchema);
