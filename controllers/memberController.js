const Member = require("../models/memberModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");
const path = require('path');
const fs = require('fs');


//Get all Hotels => /api/v1/jobs
exports.getToursite = async (req, res, next) => {
 const member = await Member.find({})
  res.status(200).json({
  
    data: member
  });
};

exports.createMember = catchAyncErrors(async (req, res, next) => {

  console.log(req.files)

  if (!req.files) {
    return next(new ErrorHandler('Please upload file.', 400));
  }
  const file = req.files.image;
 
  const supportedFiles = /.png|.jpg|.jpeg|.svg/;
  if (!supportedFiles.test(path.extname(file.name))) {
    return next(new ErrorHandler('Please upload images (png,jpg,jpeg,svg).', 400))
  }

  file.name = `${Date.now()}${path.parse(file.name).ext}`;
  file.mv(`./public/member/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler('Resume upload failed.', 500));
    }
  });

  req.body.image = `/member/${file.name}`


  const member = await Member.create(req.body);
  res.status(200).json({
    success: true,
    message: "successful",
    data: member,
  });
});




