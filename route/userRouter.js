const express = require('express');
const userController = require('./../controllers/userController');
const ErrorHandler = require('./../asset/ErrorHandler');

const router = express.Router();

// add this route before :params, otherwise it execute that insted of this.
router.route('/top-5-documents').get(userController.top5documents, userController.getAllUsers);

router.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router.route('/:id') 																	// params must be after any sub path
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);


router.all('*', (req, res, next) => {
	next( new ErrorHandler('Opps!!! no users route exists', 404) );
});

module.exports = router;

