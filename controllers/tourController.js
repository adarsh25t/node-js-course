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

        // * BUID QUERY
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el=> delete queryObj[el]);
        
        // * ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Tour.find(JSON.parse(queryStr));

        // * SORTING
        if (req.query.sort) {

            // * multiple items sort ( remove , and add empty space )
            let sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy)
        }

        // * FIELDS ( SPECIFIC FIELDS )
        if (req.query.fields) {

            // * multiple items  ( remove , and add empty space )
            let fields = req.query.fields.split(",").join(" ");
            query = query.select(fields)
        }


        // * PAGINATION 
        if(req.query.page) {
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 1;
            const skip = (page - 1) * limit;
            // page=2&limt=10 21-10 ( 2* 10 - 10 )
            query = query.skip(skip).limit(limit);

            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error("This page is does not exist!")
        }
        
        // * EXECUTE QUERY
        const tours = await query;
        

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