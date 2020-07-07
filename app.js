const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');


const port = process.env.PORT || 8000;
const app = express();
app.set('port', port);

//-----------[ Middleware ]-----------
// [1] : self Middleware
app.use( (req, res, next) => { 													// (1) Create self Middleware
	req.addMyPropertyOfTime = new Date().toString(); 			// req is object so I can create any property or method.
	next(); 																							// Pass request to next middleware.
});


// [2] : Built-in Middleware
// Because req Object doesn't have property to send data
// we have to create, because post request require body to send data,
// if want to send data as post without HTML form.
app.use( express.json() ); 															// Add a property called body in 	req.body

// [3] : 3rd party Middleware
// 1. Install by $ npm install morgan
// 2. Include in project 	require('morgan');
// 3. Use as middleware. 															// Show feedback on console.
app.use( morgan('dev') ); 														// Login functionality healper.




//-----------[ CRUD Read ]-----------

// read only one time, insted of every request
let file = path.resolve(__dirname, 'public', 'files', 'users.json');
let users = JSON.parse( fs.readFileSync(file, 'utf8') );

const getAllUsers =  (req, res) => {
	res.status(200).json({ 																// 200 = ok, 201 = created
		status 	: 'success',
		requestedAt 	: req.addMyPropertyOfTime, 						// (2) Add My created property here from (1)
		length 	: file.length,
		data 		: { users : users }
	});
}

const getUser =  (req, res) => {
	let id = req.params.id;
	id = id * 1; 																									// convert id to number
	let data = users.find( (item) => item.id === id ); 							// if match then return that item == object

	if(data) {
		res.status(200).send(data);
	} else {
		res.status(404).send('Not found');
	}
}

const createUser =  (req, res) => {
	let nextId = users[users.length - 1].id + 1;
	let newUser = Object.assign({}, req.body, {id : nextId} ); 		// last item override previous item
	// Array Push 		: Suitable for Database.
	// appendFile 		: Safest for File
	users.push(newUser);

	fs.writeFile(file, JSON.stringify(users), 'utf8', (err) => {
		if( err ) throw err;
		res.status(201).send('success');
	});
}
const updateUser =  (req, res) => {
	let updateData = users.find( (item) => item.id === req.params.id * 1 );
	if(updateData) {
		res.status(200).json({status: 'success', message: updateData });
	} else {
		res.status(404).json({status: 'fail', message: 'File Not Found.' });
	}
}

// exectly same as patch method except 3 changes
// 1. app.patch => app.delete
// 2. res.status(200) => res.status(204) == No content
// 3. { message: updateData } 	=> { message: null }
const deleteUser =  (req, res) => {
	let updateData = users.find( (item) => item.id === req.params.id * 1 );
	if(updateData) {
		res.status(204).json({status: 'success', message: null });
	} else {
		res.status(404).json({status: 'fail', message: 'File Not Found'});
	}
}


// ----- set version, to change later, without break current's users code
// app.get('/api/v1/users', getAllUsers);
// app.post('/api/v1/users', createUser); 				//-----------[ CRUD Creat ]-----------
// app.get('/api/v1/users/:id', getUser);
// app.patch('/api/v1/users/:id', updateUser); 	//-----------[ CRUD Update ]-----------
// app.delete('/api/v1/users/:id', deleteUser); 	//-----------[ CRUD Delete ]-----------

// added this route into that format.
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);


app.listen(port, () => { console.log(`Listening Port: ${app.get('port')}`) });




