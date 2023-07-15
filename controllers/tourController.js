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
}