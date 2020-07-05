const path = require('path');
const express = require('express');

const homeController = require('./controllers/homeController');

const port = process.env.PORT || 8000;
const app = express();
app.set('port', port);

app.get('/', homeController.homePage );


app.listen(port, () => { console.log(`Listening Port: ${app.get('port')}`) });



