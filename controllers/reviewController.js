const Review = require("../models/reviewModel")
const AppError = require("../utils/appError")

exports.createReview = async (req,res,next) => {
    try {
        let newReview = await Review.create(req.body);

        res.status(201).json({
            status:'success',
            data:{
                review:newReview
            }
        })
        
    } catch (error) {
        next(new AppError(`${error}`,404))
    }
}

exports.getAllReview = async (req,res,next) => {
    try {
        let reviews = await Review.find();

        res.status(200).json({
            status:"success",
            data:{
                reviews
            }
        })
        
    } catch (error) {
        next(new AppError(`${error}`,404))
    }
}