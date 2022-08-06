const mongoose = require("mongoose");
const validator = require("validator");

const restaurantSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: [true, "Please enter industry for this job."],
        enum: {
            values: [
                "Fast Foods",
                "Casual Dining",
                "Cafes",
                "Pizzerias",
                "Chinese",
                "Italian",
                "Turkish",
                "Local Cuisine",
                "Fine Dining",
                "Pub"
            ],
            message: "Please select correct options for industry.",
        },
    },
    about: {
        type: String,
        required: [true, "Please about is required."]
    },
    deviveryService: {
        type: Boolean,
        required: [true, "Please select delivery service option."],
        default: false
    },
    landingPageImage: {
        type: String,
        required: [true, "Please add landing page image."],
    },
    gallery: {
        type: [String],
        required: [true, "Please add gallery images."],
        maxlength: 5
    }

});




module.exports = mongoose.model("restaurants", restaurantSchema);
