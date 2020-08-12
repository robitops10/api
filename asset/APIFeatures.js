
class APIFeatures {
	constructor(query, queryString) {
		// 1) this.query  is userModel.find() 		=> Query (mongoose's Object)
		// 2) every methods modify this.query
		// 3) Finally APIFeatures.prototype.query == features.query 	(Access Class Properties)
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		let queryObj = { ...this.queryString };

		const excluded = [ 'sort', 'fields', 'page', 'limit' ];
		excluded.forEach( item => delete queryObj[item] );

		let queryStr = JSON.stringify( queryObj );
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
		queryObj = JSON.parse( queryStr );

		// modify this.query property here
		this.query.find( queryObj );

		return this;
	}
	sort () {
		let sort = this.queryString.sort;
		// modify this.query property here
		sort ? this.query.sort( sort.split(',').join(' ') ) : this.query;
		return this;
	}
	projection() {
		let fields = this.queryString.fields;
		// modify this.query property here
		fields ? this.query.select( fields.replace(/,/g, ' ') ) : this.query.select('-__v');
		return this;
	}
	pagination() {
		// 4) Pagination
		// page1 = 1 - 10, 		page2 = 11 - 20, 		page3 = 21 - 30 ....
		let page = this.queryString.page * 1 || 1;
		let limit = this.queryString.limit * 1 || 3;
		let skip = (page - 1) * limit; 						// lastPage * limit
		// let countDocuments = await userModel.countDocuments();
		// if(skip >= countDocuments ) throw Error('No more Page left.');
		// modify this.query property here
		this.query.skip(skip).limit(limit);
		return this;
	}
}

module.exports = APIFeatures;
