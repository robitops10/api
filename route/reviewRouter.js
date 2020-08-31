const express = require('express');
const reviewController = require('./../controllers/reviewController');
const loginController = require('./../controllers/loginController');

// 	merge routed params into this route.
// 	/:tourId/reviews 	=>	 reviewRouter router.
const router = express.Router( { mergeParams : true } );

/*
** this Router controller can acces by 2 route
** 	1. /api/v1/review 								= without params 					: reviewRouter.js
** 	2. /api/v1/tours/:tourId/review 	= has params = tourId 	 	: tourRouter.js
*/


router.use( loginController.protect ); 						// (1) Every Route is protected after it

router.route('/')
	.get(reviewController.getAllReviews)
	.post(
		loginController.restrictTo('user'), 					// (2) Only user can create post ( no admin or others)
		reviewController.createReviewMiddleware,
		reviewController.createReview
	);


router.route('/:id')
	.get(reviewController.getReview)
	.patch(loginController.restrictTo('user'), reviewController.updateReview)
	.delete(loginController.restrictTo('user'),reviewController.deleteReview);

module.exports = router;
