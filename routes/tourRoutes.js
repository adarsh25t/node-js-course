const express = require('express');
const { getAllTours, createTour, getTour, deleteTour, updateTour, getTourStarts, getMonthlyPlan } = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const tourRouter = express.Router();

tourRouter
    .route('/')
    .get(protect,getAllTours)
    .post(createTour);

tourRouter
    .route('/stats')
    .get(getTourStarts);

tourRouter
    .route('/monthly-plan/:year')
    .get(getMonthlyPlan)

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect,restrictTo('admin','lead-guide'), deleteTour)


module.exports = tourRouter;