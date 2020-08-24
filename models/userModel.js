const mongoose = require('mongoose');

// new mongoose.Schema( {schema} [,{option}] )
const userSchema = new mongoose.Schema({
	index : {
		type: Number,
		unique : true
	},
	name: {
		type: String,
		required: [true, 'User must have a name']
	},
	isActive : {
		type: Boolean,
		default: false
	},
	registered: {
		date: {
			type: Date,
			default : Date.now()
		}
	},
	age : Number,
	gender : {
		type : String,
		required: [ true, 'Require gender type' ],
		enum: {
			values : ['male', 'female', 'clip'],
			message : 'Gender will be eighter male or female or clip'
		}
	},
	eyeColor : String,
	favoriteFruit: String,
	company : {
		title: { type: String, required: [true, 'company name']},
		email: { type: String, required: [true, 'company name'], unique: true},
		phone: String,
		location: {
			country : String,
			address : String
		}
	},
	tags: [String]
}, { 																							// (1) Enable Virtual field, not really exits in database.
	toJSON 			: { virtuals: true }, 							// add when return query as JSON String
	toObject 		: { virtuals: true } 								// when return as Object
});

userSchema.virtual('adult').get( function () { 		// (2) Add Virtual Fields adult: elder | teneger
	return this.age > 20 ? 'elder' : 'teneger';
});



let userModel = mongoose.model('User', userSchema);
module.exports = userModel;


// let User = new userModel({
// 	name 				: 'Diana',
// 	gender 			: 'female',
// 	profession 	: 'student',
// 	age 				: 24
// });


// User.save()
// 	.then( data => console.log(data))
// 	.catch( err => console.log( err ));


