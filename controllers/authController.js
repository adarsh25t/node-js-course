const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signInToken = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createTokenAndSendResponse = (user,statusCode,res) => {
    let token = signInToken(user._id)
        res.status(statusCode).json({
            status: 'success',
            token,
            data:{
                user
            }
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
        createTokenAndSendResponse(newUser,201,res)
        
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
        createTokenAndSendResponse(user,200,res)
        
    } catch (error) {
        
    }
}

exports.protect = async (req,res,next) => {

    // 1. GETTING THE TOKEN AND CHECK IT'S THERE

    let token;
    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next( new AppError("You are not logged in!",401))
    }

    // 2. VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
    // 3. CHECK IF THE USER STILL EXIST
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next( new AppError("User is not exist!",401))
    }

    // 4. CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next( new AppError("User recently changed password! please log in again.",401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next()
}


exports.restrictTo = (...role) => {

    return (req,res,next) => {
        if (!role.includes(req.user.role)) {
            return next( new AppError("You do not have permission to perform this action!",403))
        }
        next();
    }
}

exports.forgotPassword = async (req,res,next) => {
    try {
        // 1. GET THE USER BASED ON THE EMAIL ID
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next( new AppError("there is no user with email address.",404))
        }

        // 2. GENERATE RANDOM RESET TOKEN
        const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })

        // 3. SEND IT TO THE USER'S EMAIL
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`
        const message = `Forgot your password? submit your new password and confirm password.\n ${resetURL}`

       await sendEmail({
            email: user.email,
            subject: "Your password reset token ( valid for 10 min ) ",
            message
       })

       res.status(200).json({
            status: "success",
            message: "Token sent to email!"
       })

    } catch (error) {
        return next( new AppError(error.message,404))
    }
}

exports.resetPassword = async (req,res,next) => {
    try {

        // 1. GET USER BASED ON THE TOKEN
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ passwordResetToken: hashedToken,passwordResetExpires: { $gt: new Date() } });

        // 2. IF TOKEN HAS NOT EXPIRED, AND THERE IS USER, SET THE NEW PASSWORD
        if (!user) {
            return next( new AppError("Token is invalid or has expired",400))
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save()
        
        // 3. UPDATE CHANGEDPASSWORDAT PROPERTY FOR THE USER

        // 4. LOG THE USER IN, SEND JWT
        createTokenAndSendResponse(user,200,res)
        
    } catch (error) {
        return next( new AppError(error.message,404)) 
    }
}

exports.updatePassword = async (req,res,next) => {
    try {
        // 1. GET USER FROM THE COLLECTION
        const user = await User.findById(req.user._id).select("+password");

        // 2. CHECK POSTED CURRENT PASSWORD IS CURRECT
        if (!(await user.correctPassword(req.body.passwordCurrent,user.password))) {
            return next( new AppError("Your current password is wrong!",401)) 
        }

        // IF SO, UPDATE PASSWORD
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        // LOG USER IN, SEND JWT
        createTokenAndSendResponse(user,200,res)
        
    } catch (error) {
        return next( new AppError(error.message,404)) 
    }
}