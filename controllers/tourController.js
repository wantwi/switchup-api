const multer = require('multer');
const Tour = require('../models/tourModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");






exports.createTour = catchAyncErrors(async (req, res, next) => {
    const doc = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
     
    });
  });


