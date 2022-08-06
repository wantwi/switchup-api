const Facility = require("../models/facilityModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const path = require('path');
const fileUploadService = require('../config/s3');
//Get all Hotels => /api/v1/jobs
exports.getAll = async (req, res, next) => {
    const { params } = req
    const { facilityType } = params
    let facilities = null;
    if (facilityType) {
        facilities = await Facility.find({ facilityType })
    }

    else {
        facilities = await Facility.aggregate([
            {
                $facet: {
                    hotels: [

                        {
                            $match: {
                                "facilityType": "hotels",

                            },

                        }

                    ],
                    restaurants: [
                        {
                            $match: {
                                "facilityType": "restaurants"
                            }
                        }
                    ],
                    toursites: [
                        {
                            $match: {
                                "facilityType": "toursites"
                            }
                        }
                    ]
                },

            }
        ])

        if (facilities) {
            facilities = facilities[0]
        }
    }

    res.status(200).json({
        success: true,
        data: facilities,
    });
};


exports.getAllStats = async (req, res, next) => {

    const facilities = await Facility.aggregate([
        {
            $facet: {
                hotels: [

                    {
                        $match: {
                            "facilityType": "hotels",

                        },

                    }, {
                        '$count': 'count'
                    }

                ],
                restaurants: [
                    {
                        $match: {
                            "facilityType": "restaurants"
                        }
                    }, {
                        '$count': 'count'
                    }
                ],
                toursites: [
                    {
                        $match: {
                            "facilityType": "toursites"
                        }
                    }, {
                        '$count': 'count'
                    }
                ]
            },

        }
    ])


    res.status(200).json({
        success: true,
        data: facilities[0],
    });
};



exports.getAllbyRegions = async (req, res, next) => {
    const { params } = req
    const { region } = params
    let facilities = null;
    if (region) {
        facilities = await Facility.find({ region })
    }
    else {
        facilities = await Facility.aggregate([
            {
                $facet: {
                    northern: [

                        {
                            $match: {
                                "region": "Northern",

                            },

                        }

                    ],
                    upperEast: [
                        {
                            $match: {
                                "region": "Upper East"
                            }
                        }
                    ],
                    upperWest: [
                        {
                            $match: {
                                "region": "Upper West"
                            }
                        }
                    ],
                    savannah: [
                        {
                            $match: {
                                "region": "Savannah"
                            }
                        }
                    ],
                    bono: [
                        {
                            $match: {
                                "region": "Bono"
                            }
                        }
                    ],
                    bonoEast: [
                        {
                            $match: {
                                "region": "Bono East"
                            }
                        }
                    ],
                    ahafo: [
                        {
                            $match: {
                                "region": "Ahafo"
                            }
                        }
                    ],
                    western: [
                        {
                            $match: {
                                "region": "Western"
                            }
                        }
                    ],
                    westernNorth: [
                        {
                            $match: {
                                "region": "Western North"
                            }
                        }
                    ],
                    northEast: [
                        {
                            $match: {
                                "region": "North-East"
                            }
                        }
                    ],
                    oti: [
                        {
                            $match: {
                                "region": "Oti"
                            }
                        }
                    ],
                    volta: [
                        {
                            $match: {
                                "region": "Volta"
                            }
                        }
                    ],
                    eastern: [
                        {
                            $match: {
                                "region": "Western"
                            }
                        }
                    ],
                    central: [
                        {
                            $match: {
                                "region": "Central"
                            }
                        }
                    ],
                    ashanti: [
                        {
                            $match: {
                                "region": "Ashanti"
                            }
                        }
                    ],
                    greaterAccra: [
                        {
                            $match: {
                                "region": "Greater Accra"
                            }
                        }
                    ]
                },

            }
        ])

        if (facilities) {
            facilities = facilities[0]
        }
    }

    res.status(200).json({
        success: true,
        data: facilities,
    });
};


exports.searchFacility = catchAyncErrors(async (req, res, next) => {
    let facilities = null
    const { query } = req


    console.log(query);

    if (Object.keys(query).length > 0) {
        const { location = "", category = "all", type = "" } = query
        if (query?.location) {
            if (category.toLowerCase() === "all") {
                facilities = await Facility.find({ location: { $regex: location, $options: 'i' } })
            }
            else {
                facilities = await Facility.find({ $and: [{ location: { $regex: location, $options: 'i' } }, { facilityType: { $regex: category, $options: 'i' } }] })
            }
        }
        else if (location === "" && category.length > 0) {
            facilities = await Facility.find({ facilityType: { $regex: category, $options: 'i' } })
        }
    }

    else {
        console.log("here");
        facilities = await Facility.find({})
    }

    res.status(200).json({
        success: true,
        count: facilities.length,
        data: facilities,
    });

})

exports.addFacility = catchAyncErrors(async (req, res, next) => {
    console.log(req)
    let galleryImages = [];
    const { params } = req
    const { facilityType } = params
    const supportedFiles = /.png|.jpg|.jpeg|.svg/;

    //console.log(req.body)



    if (facilityType.toLowerCase() === "hotels") {
        const categoryOpts = [
            "hotels",
            "motels",
            "resorts",
            "airbnds",
            "casino hotels",
            "hostels",
            "inns",
            "bed & breakfast",
            "bed and breakfast"
        ]

        // if (!req.body.hasOwnProperty('amenities') || req.body?.amenities.length === 0) {
        //     return next(new ErrorHandler("Hotels requires amenities", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }

        // req.body.amenities = req.body.amenities.split(',')
    }
    else if (facilityType.toLowerCase() === "restaurants") {
        const categoryOpts = [
            "fast foods",
            "casual dining",
            "cafes",
            "pizzerias",
            "chinese",
            "italian",
            "turkish",
            "local cuisine",
            "fine dining",
            "pub"
        ]

        // if (!req.body.hasOwnProperty('deviveryService')) {
        //     return next(new ErrorHandler("Devivery Service option is required", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }
    }
    else if (facilityType.toLowerCase() === "toursites") {
        // const categoryOpts = [
        //     "historical & heritage attractions",
        //     "historical and heritage attractions",
        //     "beaches",
        //     "national parks",
        //     "waterfalls",
        //     "mountains & hills",
        //     "mountains and hills",
        //     "islands",
        //     "forests",
        //     "entertainment parks",
        //     "wildlife attractions",
        //     "museums & art galleries",
        //     "museums and art galleries",
        //     "stadiums",
        //     "exhibitions",
        //     "festivals",
        //     "others"
        // ]

        // if (!req.body.hasOwnProperty('thingsTodo') || req.body?.thingsTodo.length === 0) {
        //     return next(new ErrorHandler("Things Todo is required", 400));
        // }
        // if (!req.body.hasOwnProperty('bestVisitingTime')) {
        //     return next(new ErrorHandler("Best Visiting Time is required", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }
    }

    if (!req.files) {
        return next(new ErrorHandler('Please upload file.', 400));
    }


     const file = req.files.landingPageImage;
     const gallery = req.files.gallery;

    // if (gallery.length < 5) {
    //     return next(new ErrorHandler('Please upload 5 images for gallery.', 400));
    // }

    // uploadFile(file)

    //let arr = [], uploadRes = null,  gallery_1 = "", gallery_2 = "", gallery_3 = "", gallery_4 = "", gallery_5 = ""
    // gallery.map((item, idx) => {
    //     count = count + 1
    //     fileUploadService.uploadFileToAws(item, "hotels").then(data => {
    //         console.log({ data })
    //         arr.push(data)
    //     });


    // })


    // const uploadRes = await fileUploadService.uploadFileToAws(file, facilityType);
    // const gallery_1 = await fileUploadService.uploadFileToAws(gallery[0], facilityType);
    // const gallery_2 = await fileUploadService.uploadFileToAws(gallery[1], facilityType);
    // const gallery_3 = await fileUploadService.uploadFileToAws(gallery[2], facilityType);
    // const gallery_4 = await fileUploadService.uploadFileToAws(gallery[3], facilityType);

    // const gallery_5 = await fileUploadService.uploadFileToAws(gallery[4], facilityType);



    // if (uploadRes && gallery_1 && gallery_2 && gallery_3 && gallery_4 && gallery_5) {

    //     // return res.status(200).send({ uploadRes, arr })

    //     req.body.landingPageImage = uploadRes.fileUrl
    //     req.body.gallery = [gallery_1.fileUrl, gallery_2.fileUrl, gallery_3.fileUrl, gallery_4.fileUrl, gallery_5.fileUrl]
    //     req.body.facilityType = facilityType

    //     const facility = await Facility.create(req.body);
    //     res.status(200).json({
    //         success: true,
    //         message: "successful",
    //         data: facility,
    //     });

    // }






    if (!supportedFiles.test(path.extname(file.name))) {
        return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
    }



    gallery.map((item, idx) => {

        if (!supportedFiles.test(path.extname(item.name))) {
            return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
        }

        item.name = `${Date.now()}_${idx}_${path.parse(file.name).ext}`;

        galleryImages.push(`/${facilityType}/${item.name}`)

        file.mv(`./public/${facilityType}/${item.name}`, err => {
            if (err) {
                console.log(err);
                return next(new ErrorHandler('Image upload failed.', 500));
            }

        });
    })


    file.name = `${Date.now()}${path.parse(file.name).ext}`;


    file.mv(`./public/${facilityType}/switchup_${facilityType}_${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorHandler('Image upload failed.', 500));
        }
    });

   

    req.body.landingPageImage = `/${facilityType}/${file.name}`
    req.body.gallery = galleryImages
    req.body.facilityType = facilityType

     const facility = await Facility.create(req.body);
        res.status(200).json({
            success: true,
            message: "successful",
            data: facility,
        });



});

// Get a single hotel by id   =>  /api/v1/hotel/:id
exports.getById = catchAyncErrors(async (req, res, next) => {
    const facility = await Facility.findOne({ _id: req.params.id })

    // if (!facility) {
    //     return next(new ErrorHandler("No record", 404));
    // }

    res.status(200).json({
        success: true,
        data: facility,
    });
});

exports.addRegion = catchAyncErrors(async (req, res, next) => {


    let response = await Facility.findById(req.params.id);

    if (!response) {
        return next(new ErrorHandler('Facility not found', 204))
    }

    console.log({ ...response, ...req.body })

    const facility = await Facility.updateOne({ _id: req.params.id }, { $set: { ...req.body } });

    res.status(200).json({
        success: true,
        data: facility,
    });

});


exports.removeFacility = catchAyncErrors(async (req, res, next) => {

    let response = await Facility.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({
        success: true,
        data: response,
    });

});





