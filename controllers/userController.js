const User = require("../models/userModel")
const AppError = require("../utils/appError")


exports.getAllUsers = async (req,res,next) => {
    try {
        let users = await User.find();

        res.status(200).json({
            status:'success',
            data:{
                users
            }
        })
        
    } catch (error) {
        next(new AppError(`${error}`,404))
    }
}