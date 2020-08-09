const userModel = require('./../models/userModel');



exports.getAllUsers = async (req,res) => {
	try {

		// 1) query filtering
		let queryObj = { ...req.query };
		const excluded = [ 'sort', 'fields', 'page', 'limit' ];
		excluded.forEach( item => delete queryObj[item] );

		// advance query filtering
		// req.query 	== 	?name=riaz&age=20 				=>  { name: 'riaz', age: 20}
		// req.query 	== 	?name=riaz&age[gte]=20 		=>  { name: 'riaz', age: {gte: 20} }
		let queryStr = JSON.stringify( queryObj );
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
		queryObj = JSON.parse( queryStr );

		// sorting by query
		let query = userModel.find( queryObj ); 					//


		// 2) sorting
		let sort = req.query.sort;
		query = sort ? query.sort( sort.replace(',', ' ') ) : query;


		// 3) projection
		let fields = req.query.fields;
		query = fields ? query.select( fields.replace(',', ' ') ) : query.select('-__v');

		// 4) Pagination
		// page1 = 1 - 10, 		page2 = 11 - 20, 		page3 = 21 - 30 ....
		let page = req.query.page * 1 || 1;
		let limit = req.query.limit * 1 || 3;
		let skip = (page - 1) * limit; 						// lastPage * limit

		let countDocuments = await userModel.countDocuments();

		if(skip >= countDocuments ) throw Error('No more Page left.');
		query = query.skip(skip).limit(limit);


		let users = await query;


		res.status(200).json({
			status 	: 'success',
			count 	: users.length,
			data 		: users
		});

	} catch(err) {
		res.status(404).json({
			status : 'fail',
			message : err
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		// let user = await userModel.findOne();
		let user = await userModel.findById(req.params.id);
		// let user = await userModel.find({'_id': req.params.id});

		res.status(200).json({
			status 	: 'success',
			data 		: user
		});

	} catch(err) {
		res.status(404).json({
			status : 'fail',
			message : err
		});
	}
};
exports.createUser = async (req,res) => {
	try {
		let newUser = await userModel.create(req.body);

		res.status(201).json({
			status	: 'success',
			data 		: newUser
		});
	} catch(err) {
		res.status(404).json({
			status 	: 'fail',
			message : err
		});

	}
};

exports.updateUser = async (req, res) => {

	try {
		let user =	await userModel.findByIdAndUpdate(req.params.id, req.body, {
			new : true,  									// Return modified Query
			runValidators: true
		});

		res.status(201).json({
			status 	: 'success',
			data 		: user
		});
	} catch(err) {
		res.status(404).json({
			status 	: 'fail',
			data 		: err
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		let user = await userModel.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status : 'success',
			data : user
		});
	} catch(err) {
		res.status(404).json({
			status : 'fail',
			data : err
		});
	}
};


// this 3 fields pass to next middleware which is 	getAllUsers(),
// this middleware act as user pass this 3 fiels: 	/?sort='-age,name&limit=5&fields=name,age,gender,eyeColor,-_id'
exports.top5documents = (req, res, next) => {
	req.query.sort = '-age name'; 												// We have to pass as it required <space> seperated
	req.query.limit = '5'; 																// If pass as url comma seperated then it will not work
	req.query.fields = 'name age gender eyeColor -_id'; 	// Remember how we handle if exits then check.
	next();
};







