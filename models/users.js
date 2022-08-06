const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      validate: [validator.isEmail, "Please enter valid email address"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: {
        values: ["user", "guide", "lead-guide", "admin"],
        message: "Please select correct role",
      },
      default: "user",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
          select: false
        },
        select: false
      },
      
    ]
    
    ,
    password: {
      type: String,
      required: [true, "Please enter password for your account"],
      minlength: [8, "Your password must be at least 8 characters long"],
      select: false,
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JSON Web Token
userSchema.methods.getJwtToken = function () {
  const user = this;
  const token = jwt.sign({ id: this._id }, "switch_up@123-cXy-u109.L_123", {
    expiresIn: "7d",
  });

  user.tokens.push({ token });

  //console.log(user);
  user.save();
  return token;
};

// Compare user password in database password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
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
userSchema.virtual("jobsPublished", {
  ref: "Job",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
