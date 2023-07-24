const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.signUp = async (req,res,next) => {
    try {
        let newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data:{
                newUser
            }
        })
        
    } catch (error) {
        next(new AppError(`${error}`,404))
    }

}

