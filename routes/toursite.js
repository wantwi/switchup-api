const express = require("express");
const router = express.Router();

const { createToursite, getToursite, getById } = require("../controllers/toursiteController");

//  const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");


// router.route("/admin/login").post(loginUser);
// router.route("/admin/register").post(registerUser);

router.route("/tour").get(getToursite);
router.route("/tour").post(createToursite);

module.exports = router;