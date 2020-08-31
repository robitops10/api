const express = require('express');
const loginController = require('./../controllers/loginController.js');

const router = express.Router();

/*
	- There are 2 ways to authentication & authorization
				. Authentication 	by 	protect 			middleware
				. authorization 	by 	restrictTo() 	middleware

		1. Add both authentication & authorization with every Route.
		2. Add authentication & authorization as middleware globally to specific route.
				. Remember Middleware run one after another.
*/

// ---------------------------[ Unprotected ]---------------------------

// this 4 route: no need any authentication & authorization to perform task, just need crediantials.
router.post('/signup', loginController.signup);
router.post('/login', loginController.login);
router.post('/forgotPassword', loginController.forgotPassword);
router.patch('/resetPassword/:token', loginController.resetPassword);


// ---------------------------[ Protected (Need to Login) ]---------------------------

/*
	- this 4 route: need authentication only.
			Adding authentication for every route. like this:
			  router.patch('/updateMyPassword',loginController.protect, loginController.updatePassword);

			Or Adding global route (for this Router)
				router.use( loginController.protect ); 						[ after this all route must pass this step 1st ]
			  router.patch('/updateMyPassword', loginController.updatePassword);
				router.patch('/updateMe', loginController.updateMe);
				....
*/

router.use( loginController.protect );	 			// (1)  [ after this all route must pass this step 1st ]
router.patch('/updateMyPassword', loginController.updatePassword);
router.patch('/updateMe', loginController.updateMe);
router.delete('/deleteMe', loginController.deleteMe);
router.get('/me', loginController.getMeMiddleware, loginController.getMe);
/*
	- We want to use the same getOne function End Point.
	  But it require req.user._id 	insted of 	req.params.id. 	How can we solve this ?
	- Well
			1) we add protect middleware,  	which add 	req.user._id
			2) We set req.params.id 	=> req.user._id  in a middleware,	before getMe Middleware
			3) Now our 	req.params.id 	=== 	req.user._id 		so we can use getOne End Point Function
*/




// ---------------------------[ Protected & Need Permissions ]---------------------------

router.use( loginController.restrictTo('admin') );	 	// (2)  Only admin user can pass after this
// 1) It is Protected 								: Because it is after (1) Global (Router) Middleware
// 2) It is Restrict To only Admin 		: Because it is after (2) Global (Router) Middleware

router.route('/')
	.get(loginController.getAllLogins)
	.post(loginController.createLogin);

router.route('/:id')
	.get(loginController.getLogin)
	.patch(loginController.updateLogin) 							// never give to update password & role by gobal update.
	.delete(loginController.deleteLogin);


module.exports = router;
