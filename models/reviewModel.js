const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String
    },
    rating:{
        type: Number,
        min:1,
        max:5,
        default:4
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:"Tour"
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

reviewSchema.pre(/^find/, function(next) {
    this.populate(['user','tour']);
    next()
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review