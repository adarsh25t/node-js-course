const express = require('express');
const { signUp } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup',signUp);

userRouter
    .route('/')
    .get(getAllUsers)


module.exports = userRouter;