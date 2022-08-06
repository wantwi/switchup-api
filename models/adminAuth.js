const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    username: {
      type: String,
      required: [true, "Please enter your username"],
      unique: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: {
        values: ['guide', 'lead-guide', "admin"],
        message: "Please select correct role",
      },
      default: "guide",
    },
    password: {
      type: String,
      required: [true, "Please enter password for your account"],
      minlength: [8, "Your password must be at least 8 characters long"],
      select: false,
    },
    refreshToken: {
      type: String,
      select: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encypting passwords before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JSON Web Token
adminSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, "switch_up@123-cXy-u109.L_123", {
    expiresIn: "7d",
  });
};

// Compare user password in database password
adminSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};


// Generate Password Reset Token
adminSchema.methods.getRefreshToken = function () {
  const user = this;
  const refreshToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken
  this.refreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = refreshToken

  //console.log(user);
  user.save();

  return refreshToken;
};

//

// Generate Password Reset Token
adminSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

// Show all jobs create by user using virtuals
// adminSchema.virtual('jobsPublished', {
//     ref : 'Job',
//     localField : '_id',
//     foreignField : 'user',
//     justOne : false
// });

module.exports = mongoose.model("adminuser", adminSchema);