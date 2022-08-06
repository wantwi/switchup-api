const Job = require("../models/jobs");
// const geocoder = require("../utils/geocoder");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");
const path = require('path');
const fs = require('fs');


//Get all Jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
  const apiFilters = new APIFilters(Job.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination();

  const jobs = await apiFilters.query.populate({
    path:'user',
    select:"name"
  })
;
  // const jobs = await Job.find({})

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
};

exports.createJob = catchAyncErrors(async (req, res, next) => {
  //adding user
  req.body.user = req.user.id;

  const job = await Job.create(req.body);
  res.status(200).json({
    success: true,
    message: "Job created",
    data: job,
  });
});

// Get a single job with id and slug   =>  /api/v1/job/:id/:slug
exports.getJob = catchAyncErrors(async (req, res, next) => {
  const job = await Job.find({
    $and: [{ _id: req.params.id }, { slug: req.params.slug }],
  }).populate({
    path:'user',
    select:"name"
  })

  if (!job || job.length === 0) {
    // res.status(404).json({
    //     success:false,
    //     message:"Job not found",

    // })

    // return
    return next(new ErrorHandler("Job not found", 404));
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

//update a job => /api/v1/:id
exports.updateJob = catchAyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    // res.status(404).json({
    //     success:false,
    //     message:"Job not found",

    // })

    return next(new ErrorHandler("Job not found", 404));
  }

   // Check if the user is owner
   if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler(`User(${req.user.id}) is not allowed to update this job.`,400))
}


  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job is updated.",
    data: job,
  });
});

// Delete a Job   =>  /api/v1/job/:id
exports.deleteJob = catchAyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id).select('+applicantsApplied');

  if (!job) {
      return next(new ErrorHandler('Job not found', 404));
  }

  // Check if the user is owner
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorHandler(`User(${req.user.id}) is not allowed to delete this job.`,400))
  }

  // Deleting files associated with job

  for (let i = 0; i < job.applicantsApplied.length; i++) {
      let filepath = `${__dirname}/public/uploads/${job.applicantsApplied[i].resume}`.replace('\\controllers', '');

      fs.unlink(filepath, err => {
          if (err) return console.log(err);
      });
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
      success: true,
      message: 'Job is deleted.'
  });

})

exports.getJobByDistance = catchAyncErrors(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // const loc = await geocoder.geocode(zipcode);
  // const latitude = loc[0].latitude;
  // const longitude = loc[0].longitude;

  // const radius = distance / 3963;

  // const jobs = await Job.find({
  //   location: {
  //     $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
  //   },
  // });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: req.params,
  });
});

// Get stats about a Job   =>  /api/v1/job/stats/:topic
exports.jobStats = catchAyncErrors(async (req, res, next) => {
  let stats = await Job.aggregate([
    {
      $match: { $text: { $search: '"' + req.params.topic + '"' } },
    },
    {
      $group: {
        _id: { $toUpper: "$experience" },
        totalJob: { $sum: 1 },
        avgSalary: { $avg: "$salary" },
        avgPositions: { $avg: "$postion" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
  ]);
  if (stats.length === 0) {
    // return res.status(204).json({
    //     success: true,
    //     message: `No stats found for - - ${req.params.topic}`,
    // })

    return next(
      new ErrorHandler(`No stats found for - - ${req.params.topic}`, 204)
    );
  }
  res.status(200).json({
    success: true,
    message: "Status.",
    stats,
  });
});


// Apply to job using Resume  =>  /api/v1/job/:id/apply
exports.applyJob = catchAyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id).select('+applicantsApplied');

  if (!job) {
      return next(new ErrorHandler('Job not found.', 404));
  }

  // Check that if job last date has been passed or not
  if (job.lastDate < new Date(Date.now())) {
      return next(new ErrorHandler('You can not apply to this job. Date is over.', 400));
  }

  // Check if user has applied before
  for (let i = 0; i < job.applicantsApplied.length; i++) {
      if (job.applicantsApplied[i].id === req.user.id) {
          return next(new ErrorHandler('You have already applied for this job.', 400))
      }
  }

  // Check the files
  if (!req.files) {
      return next(new ErrorHandler('Please upload file.', 400));
  }

  const file = req.files.file;

  // Check file type
  const supportedFiles = /.docx|.pdf/;
  if (!supportedFiles.test(path.extname(file.name))) {
      return next(new ErrorHandler('Please upload document file.', 400))
  }

  // Check doucument size
  if (file.size > process.env.MAX_FILE_SIZE) {
      return next(new ErrorHandler('Please upload file less than 2MB.', 400));
  }

  // Renaming resume
  file.name = `${req.user.name.replace(' ', '_')}_${job._id}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async err => {
      if (err) {
          console.log(err);
          return next(new ErrorHandler('Resume upload failed.', 500));
      }

      //push object to an array

      await Job.findByIdAndUpdate(req.params.id, {
          $push: {
              applicantsApplied: {
                  id: req.user.id,
                  resume: file.name
              }
          }
      }, {
          new: true,
          runValidators: true,
          useFindAndModify: false
      });

      res.status(200).json({
          success: true,
          message: 'Applied to Job successfully.',
          data: file.name
      })

  });
});