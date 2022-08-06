const Toursite = require("../models/tourSiteModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");
const path = require('path');
const fs = require('fs');


//Get all Hotels => /api/v1/jobs
exports.getToursite = async (req, res, next) => {
  const apiFilters = new APIFilters(Toursite.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination();

  const toursites = await apiFilters.query

  res.status(200).json({
    success: true,
    count: toursites.length,
    data: toursites,
  });
};

exports.createToursite = catchAyncErrors(async (req, res, next) => {


  if (!req.files) {
    return next(new ErrorHandler('Please upload file.', 400));
  }

  let galleryImages = [];

  const file = req.files.landingPageImage;
  const gallery = req.files.gallery;
  const supportedFiles = /.png|.jpg|.jpeg|.svg/;
  if (!supportedFiles.test(path.extname(file.name))) {
    return next(new ErrorHandler('Please upload images (png,jpg,jpeg,svg).', 400))
  }

  gallery.map((item, idx) => {

    if (!supportedFiles.test(path.extname(item.name))) {
      return next(new ErrorHandler('Please upload images (png,jpg,jpeg,svg).', 400))
    }

    item.name = `${Date.now()}_${idx}_${path.parse(file.name).ext}`;

    galleryImages.push(`/toursites/${item.name}`)

    file.mv(`./public/toursites/${item.name}`, err => {
      if (err) {
        console.log(err);
        return next(new ErrorHandler('Image upload failed.', 500));
      }

    });
  })


  file.name = `${Date.now()}${path.parse(file.name).ext}`;
  file.mv(`./public/toursites/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler('Resume upload failed.', 500));
    }
  });

  req.body.landingPageImage = `/toursites/${file.name}`
  req.body.gallery = galleryImages

  req.body.thingsTodo = req.body.thingsTodo.split(',')
  const toursite = await Toursite.create(req.body);
  res.status(200).json({
    success: true,
    message: "successful",
    data: toursite,
  });
});

// Get a single hotel by id   =>  /api/v1/hotel/:id
exports.getById = catchAyncErrors(async (req, res, next) => {
  const toursite = await Toursite.findOne({ _id: req.params.id })

  if (!toursite) {
    return next(new ErrorHandler("Hotel not found", 404));
  }

  res.status(200).json({
    success: true,
    data: toursite,
  });
});



