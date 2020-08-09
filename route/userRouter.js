const express = require('express');
const userController = require('./../controllers/userController');

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

router.all('*', (req,res) => {
	res.status(404).json({
		status : 'fail',
		message : 'Opps no user Route exists'
	});
});

module.exports = router;

