const express = require("express");
const router = express.Router();
const multer  = require('multer')




const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
  getPublishedJobs,
  getUsers,
  deleteUserAdmin,
  uploadProfileImage
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");

//router.use(isAuthenticatedUser);



router.route("/me").get(isAuthenticatedUser,getUserProfile);
router.route("/me/profileimage").post(isAuthenticatedUser,uploadProfileImage);
 router.route("/jobs/applied").get(isAuthenticatedUser,authorizeRoles("user"), getAppliedJobs);
router
  .route("/jobs/published")
  .get(isAuthenticatedUser,authorizeRoles("employeer", "admin"), getPublishedJobs);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateUser);

router.route("/me/delete").delete(isAuthenticatedUser,deleteUser);

// // Admin only routes
 router.route("/users").get(isAdminAuthenticatedUser,authorizeRoles("admin"), getUsers);
router.route("/user/:id").delete(isAdminAuthenticatedUser,authorizeRoles("admin"), deleteUserAdmin);

module.exports = router;
