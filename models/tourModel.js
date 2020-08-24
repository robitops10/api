const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
	id : {
		type: Number,
		unique : true,
		required: true
	},
	login : String,
	type : String,
	site_admin : Boolean,
	node_id : String,
	avatar_url : String,
	url : String,
	html_url : String,
	followers_url : String,
	gists_url : String,
	starred_url : String,
	subscriptions_url : String,
	organizations_url : String,
	repos_url : String,
	events_url : String,
	received_events_url : String,
	startLocation : {
		type : {
			type : String,
			default : 'point',
			enum 	: ['point']
		},
		coordinates :  [ Number ],
		address: String,
		description: String
	},
	Location : [
		{
			type : {
				type : String,
				default : 'point',
				enum 	: ['point']
			},
			coordinates :  [ Number ],
			address: String,
			description: String,
			day: Number
		}
	],
	// guides : Array,
	guides : [
		{
			type: mongoose.Schema.ObjectId,
			ref : 'Login' 												// Exactly same name as Model have
		}
	]
},
{
	toJSON : { virtuals: true },
	toObject : { virtuals: true }
});



// (3rd Method) to use any tast globally.
tourSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'guides',
		select: '-__v -changePasswordAt'
	});
	next();
});


// add virtual fields
tourSchema.virtual('virtualField').get( function () {
	return 10;
});

// virtual populate (1)
tourSchema.virtual('reviews', {
	ref 	: 'Review', 								// Point to Review Model
	foreignField : 'tour', 						// From tour
	localField: '_id' 								//
});



module.exports = mongoose.model('Tour', tourSchema);
