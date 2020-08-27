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



router.route('/')
	.get(reviewController.getAllReviews)
	.post(
		loginController.protect,
		loginController.restrictTo('user'),
		reviewController.createReviewMiddleware,
		reviewController.createReview
	);


router.route('/:id')
	.get(reviewController.getReview)
	.patch(reviewController.updateReview)
	.delete(reviewController.deleteReview);

module.exports = router;
