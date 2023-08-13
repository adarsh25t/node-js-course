const express = require('express');
const { signUp, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login)

userRouter.post('/forgotpassword',forgotPassword)
userRouter.patch('/resetpassword/:token',resetPassword);
userRouter.patch('/updateMypassword',protect,updatePassword)


userRouter
    .route('/')
    .get(getAllUsers)


module.exports = userRouter;