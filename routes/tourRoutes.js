const express = require('express');
<<<<<<< HEAD
const { getAllTours, createTour, getTour, deleteTour, updateTour } = require('../controllers/tourController');
=======
const { getAllTours, createTour, getTour, deleteTour, updateTour, getTourStarts, getMonthlyPlan } = require('../controllers/tourController');
>>>>>>> f990c42 (aggregate)
const tourRouter = express.Router();

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour);

<<<<<<< HEAD
=======
tourRouter
    .route('/stats')
    .get(getTourStarts);

tourRouter
    .route('/monthly-plan/:year')
    .get(getMonthlyPlan)
>>>>>>> f990c42 (aggregate)

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)


module.exports = tourRouter;