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
	received_events_url : String
});


module.exports = mongoose.model('tours', tourSchema);
