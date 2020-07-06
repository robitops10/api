const path = require('path');
const fs = require('fs');
const express = require('express');

const homeController = require('./controllers/homeController');

const port = process.env.PORT || 8000;
const app = express();
app.set('port', port);

// Because req Object doesn't have property to send data
// we have to create, because post request require body to send data,
// if want to send data as post without HTML form.
app.use( express.json() ); 						// Add a property called body in 	req.body


app.get('/', homeController.homePage );

//-----------[ CRUD Read ]-----------

// read only one time, insted of every request
let file = path.resolve(__dirname, 'public', 'files', 'users.json');
let users = JSON.parse( fs.readFileSync(file, 'utf8') );

// set version, to change later, without break current's users code
app.get('/api/v1/users', (req, res) => {
	res.status(200).json({ 										// 200 = ok, 201 = created
		status 	: 'success',
		length 	: file.length,
		data 		: { users : users }
	});
});

app.get('/api/v1/users/:id', (req, res) => {
	let id = req.params.id;
	id = id * 1; 																									// convert id to number
	let data = users.find( item => item.id === id ); 							// if match then return that item == object

	if(data) {
		res.status(200).send(data);
	} else {
		res.status(404).send('Not found');
	}
});

//-----------[ CRUD Creat ]-----------
app.post('/api/v1/users', (req, res) => {
	let nextId = users[users.length - 1].id + 1;
	let newUser = Object.assign({}, req.body, {id : nextId} ); 		// last item override previous item
	// Array Push 		: Suitable for Database.
	// appendFile 		: Safest for File
	users.push(newUser);

	fs.writeFile(file, JSON.stringify(users), 'utf8', (err) => {
		if( err ) throw err;
		res.status(201).send('success');
	});
});

//-----------[ CRUD Update ]-----------


app.listen(port, () => { console.log(`Listening Port: ${app.get('port')}`) });




