require('dotenv').config({ path: './config.env'} );
const mongoose = require('mongoose');
const app = require('./index');


// console.log( app.get('env') );
// console.log( process.env.DB);



const db = process.env.DB;
mongoose.connect( db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex : true,
		useFindAndModify: false
	}
)
.then( () => console.log( 'database connection successfull !!!.' ) )
.catch( (err) => console.log( err.message ) );


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Running on Port : ${port}`) );


