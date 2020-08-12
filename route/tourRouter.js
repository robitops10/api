const express = require('express');
const tourController = require('./../controllers/tourController');
const ErrorHandler = require('./../asset/ErrorHandler');

const router = express.Router();


// (2)
// router.param('id', tourController.checkId);


router.route('/')
	.get(tourController.getAllTours)
	.post(tourController.checkBody, tourController.createTour);

router.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

router.all('*', (req, res, next) => {
	next( new ErrorHandler('Opps!!! no tours exists', 404) );

});

module.exports = router;
