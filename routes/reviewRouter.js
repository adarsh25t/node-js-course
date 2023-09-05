const express = require('express');
const { createReview, getAllReview } = require('../controllers/reviewController');
const reviewRouter = express.Router();

reviewRouter
    .route('/')
    .post(createReview)
    .get(getAllReview)

module.exports = reviewRouter;
