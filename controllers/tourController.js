const Tour = require("../models/tourModel");
const { apiFeatures } = require("../utils/apiFeatures");


exports.createTour = async (req,res,next) => {

    try {

        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "Success",
            data:{
                tour: newTour
            }
        })

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }
}



exports.getAllTours = async (req,res,next) => {
    
    try {

        // * EXECUTE QUERY
        const fearure = new apiFeatures(Tour.find(),req.query).sort().filter().fields().pagination();
        const tours = await fearure.query;
      
        // * SEND RESPONSE
        res.status(200).json({
            status: "Success",
            results: tours.length,
            data:{
                tours
            }
        })
        
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}

// * GET TOUR 
exports.getTour = async (req,res,next) => {

    try {
        let id = req.params.id;
        const tour = await Tour.findById(id);

        res.status(200).json({
            status: "Success",
            data:{
                tour
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}

// * UPDATE TOUR
exports.updateTour = async (req,res,next) => {

    try {
        let id = req.params.id;
        const updateTour = await Tour.findByIdAndUpdate(id,req.body,
        { 
            new: true,
            runValidators: true
        });
        
        res.status(201).json({
            status: "Success",
            data:{
                tour:updateTour
            }
        })
        
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}

// * DELETE TOUR 
exports.deleteTour = async (req,res,next) => {
    
    try {
        let id = req.params.id;
        await Tour.findByIdAndDelete(id);
        res.status(204).json({
            status: "Success"
        })
        
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
<<<<<<< HEAD
=======
}

exports.getTourStarts = async (req,res) => {

    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4 }}
            },
            {
                $group: {
                    _id: '$difficulty',
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1}
            }
        ])

        res.status(200).json({
            status: "Success",
            stats
        })
        
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}

exports.getMonthlyPlan = async (req,res) => {

    try {
        let year = req.params.year * 1
        
        let plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates"},
                    numToursStats: { $sum : 1}
                }
            }
        ])

        res.status(200).json({
            status: "Success",
            plan
        })

    }catch(error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
>>>>>>> f990c42 (aggregate)
}