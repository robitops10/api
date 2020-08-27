const express = require('express');
const tourController = require('./../controllers/tourController');
const loginController = require('./../controllers/loginController');
const reviewRouter = require('./../route/reviewRouter');

const ErrorHandler = require('./../asset/ErrorHandler');
const router = express.Router();


// (2)
// router.param('id', tourController.checkId);


router.route('/')
	.get(loginController.protect, tourController.getAllTours)
	.post(tourController.createTour);

router.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(loginController.protect, loginController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);
	// .delete(tourController.deleteTour);



/*
** same as app.use() = if match this url then to to that route == Redirect again.
** so that all review route remain in same palace
** /api/v1/tours/iasdf3dw/reviews
**
** How to pass this route's params to that route,
** 	well that express.Router({ mergeParams: true }) 	merge this params into
*/
router.use('/:tourId/reviews', reviewRouter);





router.all('*', (req, res, next) => {
	next( new ErrorHandler('Opps!!! no tours exists', 404) );

});

module.exports = router;
