const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signInToken = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signUp = async (req,res,next) => {
    try {
        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        let token = signInToken(newUser._id)

        res.status(201).json({
            status: 'success',
            token,
            data:{
                newUser
            }
        })
        
    } catch (error) {
        next(new AppError(`${error}`,404))
    }

}

exports.login = async (req,res,next) => {
    try {

        const { email, password } = req.body;

        // 1. CHECK IF EMAIL AND PASSWORD EXIST
        if (!email || !password) {
           return next(new AppError("Please Peovide Email and Password",400))
        }

        // 2. CHECK IF USER IS EXIST AND PASSWORD IS CORRECT
        
        // CHECK THE USER IS EXIST ( USING EMAIL )
        let user = await User.findOne({ email }).select('+password');

        // CHECK USER IS EXIST AND CHECK THE PASSWORD IS CORRECT
        if (!user || !(await user.correctPassword(password,user.password))) {
            return next(new AppError("Incorrect Email or Password!",400))
        }
        
        // 3. IF EVENYTHING OK, SEND TOKEN TO THE CLIENT

        // GENERATING NEW TOKEN
        let token = signInToken(user._id)
        res.status(200).json({
            status:'success',
            token
        })
        
    } catch (error) {
        
    }
}
