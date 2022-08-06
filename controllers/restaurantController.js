const Restaurant = require("../models/restaurantModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const APIFilters = require("../utils/apiFilters");
const path = require('path');
const fs = require('fs');


//Get all Hotels => /api/v1/jobs
exports.getRestaurants = async (req, res, next) => {
    const apiFilters = new APIFilters(Restaurant.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .searchByQuery()
        .pagination();

    const restaurants = await apiFilters.query

    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants,
    });
};

exports.createRestaurant = catchAyncErrors(async (req, res, next) => {


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

        galleryImages.push(`/toursites/${item.name}`)

        file.mv(`./public/toursites/${item.name}`, err => {
            if (err) {
                console.log(err);
                return next(new ErrorHandler('Resume upload failed.', 500));
            }

        });
    })


    file.name = `${Date.now()}${path.parse(file.name).ext}`;
    file.mv(`./public/restaurants/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorHandler('Image upload failed.', 500));
        }
    });

    req.body.landingPageImage = `/restaurants/${file.name}`
    req.body.gallery = galleryImages


    const restaurant = await Restaurant.create(req.body);
    res.status(200).json({
        success: true,
        message: "successful",
        data: restaurant,
    });
});

// Get a single hotel by id   =>  /api/v1/hotel/:id
exports.getById = catchAyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findOne({ _id: req.params.id })

    if (!restaurant) {
        return next(new ErrorHandler("Hotel not found", 404));
    }

    res.status(200).json({
        success: true,
        data: restaurant,
    });
});



