// review / rating / created At / ref to tour / ref to user

const mongoose = require('mongoose');

const reviewModel = new mongoose.Schema({
	review: {
		type: String,
		required : [true, 'Say something about this post']
	},
	rating : {
		type: Number,
		default: 4.7,
		min : [1, 'can\'t be lessthan 1'],
		max : [5, 'can\'t be getherthan 5']
	},
	createdAt : {
		type: Date,
		default : Date.now()
	},
	tour	: {
		type 	: mongoose.Schema.ObjectId,
		ref 	: 'Tour',
		required: [true, 'Review Must have a Tour Reference']
	},
	user : {
		type 	: mongoose.Schema.ObjectId,
		ref 	: 'Login', 																					// mine have to type of users users & login users.
		required: [true, 'Review Must have a user Reference']
	}
}, {
	toJSON 		: { vituals : true },
	toObject 	: { vituals : true }
});


reviewModel.pre( /^find/, function(next) {
	// this.populate('tour user'); 															// (1) work
	// this.populate('tour').populate('user'); 									// (2) work

	this.populate({
		path 		: 'user',
		select 	: 'name role'
	}).populate({
		path 		: 'tour',
		select 	: 'url name -guides'
	});

	// this.populate({
	// 	path 		: 'tour',
	// 	select 	: 'url name age -guides'
	// });

	next();
});

module.exports = mongoose.model('Review', reviewModel);
