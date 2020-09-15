const express = require('express');
const viewController = require('./../controllers/viewController');
const loginController = require('./../controllers/loginController');

const router = express.Router();

router.use( loginController.isLogedInUser ); 						// Add user detail for every viewRoutes

router.get('/', viewController.getHome);
router.get('/overview', viewController.getOverview);
router.get('/tour', viewController.getTour);

router.get('/login', viewController.getLogin);
router.post('/handleLogin', viewController.handleLogin);


module.exports = router;
