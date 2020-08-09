class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	filter() {
		this.query = 'Updated';
	}
}



const features = new APIFeatures('userModel', '{name: "riaz"}').filter();
// features.filter();


console.log( features.queryString );
