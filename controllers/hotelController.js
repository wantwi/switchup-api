const Hotels = require("../models/hotelModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");
const path = require('path');
const fs = require('fs');


//Get all Hotels => /api/v1/jobs
exports.getHotels = async (req, res, next) => {
  const apiFilters = new APIFilters(Hotels.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination();

  const hotels = await apiFilters.query

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
  });
};

exports.queryHotels = catchAyncErrors(async (req, res, next) => {
  let hotels = null
  const { params } = req
  if (params?.location) {
    const { location, category } = params
    if (params?.location) {
      if (category === "All") {
        hotels = await Hotels.find({ location: { $regex: location, $options: 'i' } })
      }
      else {
        hotels = await Hotels.find({ $and: [{ location: { $regex: location, $options: 'i' } }, { category }] })
      }
    }
  }

  else {
    hotels = await Hotels.find({})
  }



  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels,
  });

})

exports.createHotel = catchAyncErrors(async (req, res, next) => {


  if (!req.files) {
    return next(new ErrorHandler('Please upload file.', 400));
  }

  let galleryImages = [];

  const file = req.files.landingPageImage;
  const gallery = req.files.gallery;
  const supportedFiles = /.png|.jpg|.jpeg|.svg/;
  if (!supportedFiles.test(path.extname(file.name))) {
    return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
  }

  gallery.map((item, idx) => {

    if (!supportedFiles.test(path.extname(item.name))) {
      return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
    }

    item.name = `${Date.now()}_${idx}_${path.parse(file.name).ext}`;

    galleryImages.push(`/hotels/${item.name}`)

    file.mv(`./public/hotels/${item.name}`, err => {
      if (err) {
        console.log(err);
        return next(new ErrorHandler('Image upload failed.', 500));
      }

    });
  })


  file.name = `${Date.now()}${path.parse(file.name).ext}`;
  file.mv(`./public/hotels/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler('Resume upload failed.', 500));
    }
  });

  req.body.landingPageImage = `/hotels/${file.name}`
  req.body.gallery = galleryImages





  const hotel = await Hotels.create(req.body);
  res.status(200).json({
    success: true,
    message: "successful",
    data: hotel,
  });
});

// Get a single hotel by id   =>  /api/v1/hotel/:id
exports.getById = catchAyncErrors(async (req, res, next) => {
  const hotel = await Hotels.findOne({ _id: req.params.id })

  if (!hotel) {
    return next(new ErrorHandler("Hotel not found", 404));
  }

  res.status(200).json({
    success: true,
    data: hotel,
  });
});


const uploadFiles = (files) => {

}

