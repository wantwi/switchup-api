const mongoose = require("mongoose");
const validator = require("validator");

const toursiteSchema = new mongoose.Schema({
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
        required: [true, "Please select category."],
        trim: true,
        enum: {
            values: [
                "Historical & Heritage Attractions",
                "Historical and Heritage Attractions",
                "Beaches",
                "National Parks",
                "Waterfalls",
                "Mountains & Hills",
                "Mountains and Hills",
                "Islands",
                "Forests",
                "Entertainment Parks",
                "Wildlife Attractions",
                "Museums & Art Galleries",
                "Museums and Art Galleries",
                "Stadiums",
                "Exhibitions",
                "Festivals",
                "Others"
            ],
            message: "Please select correct options for category.",
        },
    },
    thingsTodo: {
        type: [String],
        required: [true, "Please about is required."]
    },
    about: {
        type: String,
        required: [true, "Please about is required."]
    },
    bestVisitingTime: {
        type: String,
        required: [true, "Please enter best time to visit."],

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




module.exports = mongoose.model("toursites", toursiteSchema);
