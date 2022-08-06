const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const memberSchema = new mongoose.Schema({
address: {
    type: String,
  },
  contact: {
    type: String,
  },
  dob: {
    type: String,
  },
  email: {
    type: String,
  },
  employmentType: {
    type: String,
  },
  firstName: {
    type: String,
  },
  gender: {
    type: String,
  },
  homeRegion: {
    type: String,
  },
  homeTown: {
    type: String,
  },
  lastName: {
    type: String,
  },
  mClass: {
    type: String,
  },
  memberType: {
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  profession: {
    type: String,
  },

  maritalStatus: {
    type: String,
  },
  yoj: {
    type: String,
  },
  profession: {
    type: String,
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Member", memberSchema);
