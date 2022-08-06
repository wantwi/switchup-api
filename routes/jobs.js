const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  getJobByDistance,
  updateJob,
  deleteJob,
  getJob,
  jobStats,
  applyJob
} = require("../controllers/jobController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
router.route("/jobs").get(getJobs);

router
  .route("/jobs/newjob")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin", "employeer", "user"),
    createJob
  );
router.route("/jobs/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);
router.route("/jobs/:id").put(updateJob).delete(deleteJob);
router.route("/jobs/:zipcode/:distance").get(getJobByDistance);
router.route('/job/:id/apply').put(isAuthenticatedUser, authorizeRoles('user'), applyJob)


module.exports = router;
