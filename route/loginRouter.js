const express = require('express');
const loginController = require('./../controllers/loginController.js');

const router = express.Router();



router.post('/signup', loginController.signup);
router.post('/login', loginController.login);

router.post('/forgotPassword', loginController.forgotPassword);
router.patch('/resetPassword/:token', loginController.resetPassword);

// patch because we want to manupulate user document which is already exists.
router.patch('/updateMyPassword',loginController.protect, loginController.updatePassword);


router.patch('/updateMe', loginController.protect, loginController.updateMe);
router.delete('/deleteMe', loginController.protect, loginController.deleteMe);






router.route('/')
	.get(loginController.getAllLogins)
	.post(loginController.createLogin);

router.route('/:id')
	.get(loginController.getLogin)
	.patch(loginController.updateLogin)
	.delete(loginController.deleteLogin);


module.exports = router;
