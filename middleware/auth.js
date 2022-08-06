const jwt = require("jsonwebtoken");
const User = require("../models/users");
const AdminUser = require("../models/adminAuth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Check if the user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = await User.findById(decoded.id);
  const user = await User.findOne({
    _id: decoded.id,
    "tokens.token": token,
  });

  if (!user) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }


  req.user = user

  next();
});

// handling users roles
exports.authorizeRoles = (...roles) => {

  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role(${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

exports.isAdminAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;

 

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await AdminUser.findById(decoded.id);

  next();
});
