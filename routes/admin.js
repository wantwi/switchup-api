const express = require("express");
const router = express.Router();
const cors = require('cors')
const { registerUser, loginUser, adminTest, getUserProfile, uploadProfileImage, renewToken, usersStats, AllUsersByType } = require("../controllers/adminController");

const { authorizeRoles, isAdminAuthenticatedUser } = require("../middleware/auth");


// router.route("/admin/login").post(loginUser);
// router.route("/admin/register").post(registerUser);

router.route("/admin").get(adminTest);
router.route("/admin/register").post(isAdminAuthenticatedUser, authorizeRoles('admin'), registerUser);
router.route("/admin/login").post(loginUser);
router.route("/admin/refresh").get(renewToken);

router.route("/getUsers/:userType").get(AllUsersByType)
router.route("/admin/user/me").get(isAdminAuthenticatedUser, getUserProfile);
router.route("/admin/user/profileimage").post(isAdminAuthenticatedUser, uploadProfileImage);
router.route('/users/stats').get(usersStats)
module.exports = router;