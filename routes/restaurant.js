const express = require("express");
const router = express.Router();

const { createRestaurant, getRestaurants, getById } = require("../controllers/restaurantController");

//  const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");


// router.route("/admin/login").post(loginUser);
// router.route("/admin/register").post(registerUser);

router.route("/restaurant").get(getRestaurants);
router.route("/restaurant").post(createRestaurant);

module.exports = router;