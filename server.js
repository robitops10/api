require('dotenv').config({ path: './config.env'} );
const mongoose = require('mongoose');
const app = require('./index');


// console.log( app.get('env') );
// console.log( process.env.DB);


 // $ mongo "mongodb+srv://cluster0.u3djw.mongodb.net/api2" --username riaz


// const db = process.env.DB_LOCAL;
const db = process.env.DB;
mongoose.connect( db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex : true,
		useFindAndModify: false
	}
)
.then( () => console.log( 'database connection successfull !!!.' ) )
// .catch( (err) => console.log( err.message ) );


const port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Server Running on Port : ${port}`) );


// Globally handle any Promise Rejection Error.
process.on('unhandledRejection', (err) => {
	console.log( 'By unhandledRejection Shutdown !!' )
	console.log( 	err.name, 	err.message 	);
	server.close( () => {
		process.exit(1); 												// 0 = OK, 1 = unhandledRejection
	})
});


// process.on('uncaughtException', (err) => {
// 	console.log( 'By uncaughtException Shutdown !!' )
// 	console.log( 	err.name, 	err.message 	);
// 	server.close( () => {
// 		process.exit(1);
// 	})
// });
