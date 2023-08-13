const User = require("../models/userModel")
const AppError = require("../utils/appError")

const filterObj = (obj, ...filterObj) => {
    let newObj = {}
    Object.keys(obj).forEach(el => {
        if (filterObj.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj
}

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

exports.updateMe = async (req,res,next) => {
    try {
        
        const filterBody = filterObj(req.body,"name","email");
        const updatedUser = await User.findByIdAndUpdate(req.user._id,filterBody,{new: true,runValidators: true})

        res.status(200).json({
            status:'success',
            updatedUser
        })
        
    } catch (error) {
        next(new AppError(error,404))
    }
}

exports.deleteMe = async (req,res,next) => {
    try {

        const deleteUser = await User.findByIdAndUpdate(req.user._id,{status: false});
        res.status(204).json({
            status:'success',
            data: null
        })
        
    } catch (error) {
        next(new AppError(error,404))
    }
}