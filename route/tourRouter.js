const express = require('express');
const tourController = require('./../controllers/tourController');
const loginController = require('./../controllers/loginController');
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

router.all('*', (req, res, next) => {
	next( new ErrorHandler('Opps!!! no tours exists', 404) );

});

module.exports = router;
