const mongoose = require('mongoose');
const tourModel = require('./tourModel');


// review / rating / created At / ref to tour / ref to user
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

	// this.populate({
	// 	path 		: 'user',
	// 	select 	: 'name role'
	// }).populate({
	// 	path 		: 'tour',
	// 	select 	: 'url name -guides'
	// });

	this.populate({
		path 		: 'tour',
		select 	: 'url name age avgRating nRating -guides'
	});

	next();
});



// select All Reviews of a specific Tour,
reviewModel.statics.calcAvarageRatings = async function (tourId) {

	const status =	await this.aggregate([
		// Find all tour fields which have id = tourId
		{ $match : { tour: tourId } },
		{ $group : {
		// 1st filed must by _id: CommonFieldName, tour will be common because we search that fields to find
				_id: '$tour',
				nRating: { $sum : 1 },
				avgRating : { $avg : '$rating' }
				// key 								value of existing fields find by $match
			}
		}
	]);

	if( status.length > 0 ) {
		const data = await tourModel.findByIdAndUpdate(tourId, {
			ratingQuantity 	: status[0].nRating,
			ratingAvarage		: status[0].avgRating
		});
	} else {
		const data = await tourModel.findByIdAndUpdate(tourId, {
			ratingQuantity 	: 0, 															// As Default have 0
			ratingAvarage		: 4.5 														// As Default have 4.5
		});
	}
};

reviewModel.post('save', function () {
	// point to review document.
	this.constructor.calcAvarageRatings( this.tour ); 		// pass tourId
});


// findByIdAndUpdate 	&  findByIdAndDelete 	== actually 	findOneAndUpdate	& findOneAndDelete
reviewModel.pre(/^findOneAnd/, async function(next) {
	this.r = await this.findOne();
	console.log( this.r );
	next();
});
reviewModel.post(/^findOneAnd/, async function() {
	await this.r.constructor.calcAvarageRatings(this.r.query);
});


module.exports = mongoose.model('Review', reviewModel);
