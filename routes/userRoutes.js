const express = require('express');
const { signUp, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controllers/authController');
const { getAllUsers, updateMe, deleteMe } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login)

userRouter.post('/forgotpassword',forgotPassword)
userRouter.patch('/resetpassword/:token',resetPassword);
userRouter.patch('/updateMypassword',protect,updatePassword)
userRouter.patch('/updateMe',protect,updateMe)
userRouter.delete('/deleteMe',protect,deleteMe)

userRouter
    .route('/')
    .get(getAllUsers)


module.exports = userRouter;