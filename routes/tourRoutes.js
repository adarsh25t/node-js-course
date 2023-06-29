const express = require('express');
const { getAllTours, createTour, getTour, deleteTour } = require('../controllers/tourController');
const tourRouter = express.Router();

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour);


tourRouter
    .route('/:id')
    .get(getTour)
    .delete(deleteTour)


module.exports = tourRouter;