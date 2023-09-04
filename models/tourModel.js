const mongoose = require('mongoose');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "A tour must have a name"],
        unique: true
    },
    duration:{
        type: String,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize:{
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty:{
        type: String,
        required: [true, "A tour must have a difficulty"]
    },
    ratingsAverage:{
        type: Number,
        default: 3,
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true, "A tour must have a price"],
        validate:{
            validator: function(val){
                return val >= 1000
            },
            message:"price grater than 1000"
        }
    },
    priceDiscount: Number,
    summery:{
        type: String,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
        required: [true, "a tour must have a cover image"]
    },
    images:[String],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    startDates:[Date],
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum:["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum:["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: Array,
    secretTour:{
        type: Boolean,
        default: false
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

// DOCUMENT MIDDLEWARE: RUNS BEFORE .save() and .create()
// tourSchema.pre('save',function(next) {
//     console.log("will save the document...");
//     next();
// })

// // POST MIDDLEWARE RUN LAST OF THE MIDDLEARE
// tourSchema.post('save',function(doc,next) {
//     console.log("save the file");
//     next();
// })

// QUERY MIDDLEWARE 
// tourSchema.pre('find',function(next) {
//     this.find({ secretTour: { $ne: true }})
//     next()
// })

// AGGREGATE MIDDLEWARE 
tourSchema.pre('aggregate',function(next) {
    console.log(this);
    next()
})

tourSchema.pre('save', async function(next){
    const PromiseGuides = this.guides.map( async(id) => await User.findById(id))
    this.guides = await Promise.all(PromiseGuides);

   next()
})

const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;