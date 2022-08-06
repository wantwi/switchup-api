const mongoose = require("mongoose");
const validator = require("validator");

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Job title."],
        trim: true,
        maxlength: [100, "Job title can not exceed 100 characters."],
    },
    location: {
        type: String,
        required: [true, "Please add location."],
    },
    landmarks: {
        type: String,

    },
    region:{
        type: String,
        required: [true, "Please add region."],
        trim:true,
        enum: {
            values: [
                "Greater Accra",
                "Central",
                "Eastern",
                "Western",
                "Ashanti",
                "Northern",
                "Upper East",
                "Upper West",
                "North East",
                "Savannah",
                "Bono East",
                "Ahafo",
                "Western North",
                "Oti",
                "Bono",
                "Volta"
            ],
            message: "Please select correct options for industry.",
        },

    },
    website: {
        type: String,
        required: [true, "Please add website."],
    },
    phone: {
        type: String,
        required: [true, "Please add phone number."],
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please add a valid email address."],
    },
    about: {
        type: String,
        required: [true, "Please about is required."]
    },
    category: {
        type: String,
        required: [true, "Please enter category ."],
    },
    amenities: {
        type: [String],
        // enum: {
        //     values: [
        //         "gym",
        //         "bar",
        //         "restaurant",
        //         "spa",
        //         "pool",
        //         "swimming pool"
        //     ],
        //     message: "Please select correct options for industry.",
        // },
    },
    deviveryService: {
        type: Boolean,
        default: false
    },
    thingsTodo: {
        type: [String]
    },
    bestVisitingTime: {
        type: String
    },
    minPrice:{
        type: Number,
        default:0
    },
    maxPrice:{
        type: Number,
        default:0
    },
    currency:{
        type: String,
        default:"GHS"
    },
    landingPageImage: {
        type: String,
        required: [true, "Please add landing page image."],
    },
    gallery: {
        type: [String],
        required: [true, "Please add gallery images."],
      
    },
    facilityType: {
        type: String,
        required: [true, "Please type of facility."],
    }

});




module.exports = mongoose.model("facility", facilitySchema);
