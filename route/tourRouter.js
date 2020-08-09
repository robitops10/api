const express = require('express');
const tourController = require('./../controllers/tourController');

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

router.all('*', (req,res) => {
	res.status(404).json({
		status : 'fail',
		message : 'Opps no tour Route exists'
	});
});

module.exports = router;
