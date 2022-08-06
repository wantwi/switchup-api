const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const admin = require("../controllers/adminController");

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(isAuthenticatedUser, logout);




module.exports = router;


