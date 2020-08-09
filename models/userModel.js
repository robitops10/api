const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	index : {
		type: Number,
		unique : true
	},
	name: {
		type: String,
		required: [true, 'name must have to']
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
		required: true
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
});

let userModel = mongoose.model('users', userSchema);
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


