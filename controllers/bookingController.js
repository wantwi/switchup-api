const Booking = require("../models/booking");
// const geocoder = require("../utils/geocoder");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");

exports.newBooking = catchAyncErrors(async (req, res, next) => {
    console.log(req.body);
    const doc = await Booking.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
     
    });
  });
