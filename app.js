const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');

let app = express();


app.use(express.json());


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/user',userRouter);

// ROUTER ERROR HANDLER 
app.all('*', (req,res,next) => {
    // res.status(404).json({
    //     'status':'fail',
    //     'message': `Can't find ${req.originalUrl} on the server!`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.statusCode = 404;
    // err.status = 'fail';
    
    next(new AppError(`Can't find ${req.originalUrl} on the server!`,404))
})


// ERROR HANDLING MIDLEWARE
app.use(globalErrorHandler)

module.exports = app;