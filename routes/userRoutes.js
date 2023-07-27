const express = require('express');
const { signUp, login } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login)

userRouter
    .route('/')
    .get(getAllUsers)


module.exports = userRouter;