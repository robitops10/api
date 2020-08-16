const express = require('express');
const loginController = require('./../controllers/loginController.js');

const router = express.Router();



router.post('/signup', loginController.signup);
router.post('/login', loginController.login);



router.route('/')
	.get(loginController.getAllLogins)
	.post(loginController.createLogin);

router.route('/:id')
	.get(loginController.getLogin)
	.patch(loginController.updateLogin)
	.delete(loginController.deleteLogin);


module.exports = router;
