require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const fs = require('fs');

const file = './public/files/persons.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log( data );

const db = process.env.DB;
mongoose.connect( db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex : true,
		useFindAndModify: false
	}
)
.then( () => console.log( 'database connection successfull !!!.' ) )
.catch( (err) => console.log( err ) );

const Schema = new mongoose.Schema({
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

const Persons = mongoose.model('users', Schema);


const importData = async () => {
	try{
		await Persons.create(data);
		console.log( 'data imported successfull !!');
	} catch (err) {
		console.log( err.message );
	}
	process.exit();
};


const deleteData = async () => {
	try{
		await Persons.deleteMany();
		console.log( 'data Deleted successfull !!');

	} catch (err) {
		console.log( err.message );
	}
	process.exit();
};

if(process.argv[2] === '--import') {
	importData();
} else if(process.argv[2] === '--delete') {
	deleteData();
}


// $ nodemon importData.js --import 							// imported from persons.json to users db
// $ nodemon importData.js --delete 							// delete collection





