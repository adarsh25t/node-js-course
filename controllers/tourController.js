const Tour = require("../models/tourModel")


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

        const allTours = await Tour.find()
        res.status(200).json({
            status: "Success",
            data:{
                tours: allTours
            }
        })
        
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}

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

exports.deleteTour = async (req,res,next) => {
    
    try {
        let id = req.params.id;
        const deleteTour = await Tour.findByIdAndDelete(id);
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