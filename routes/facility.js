const express = require("express");
const router = express.Router();

const { addFacility, getAll, getAllStats, getById, searchFacility,getAllbyRegions, removeFacility,addRegion } = require("../controllers/facilityController");

//  const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");

router.route("/getall").get(getAll);
router.route("/getall/:facilityType").get(getAll);
router.route("/getById/:id").get(getById);
router.route("/stats").get(getAllStats);
router.route("/search").get(searchFacility);
router.route("/add/:facilityType").post(addFacility);
router.route("/getAllbyRegions").get(getAllbyRegions);
router.route("/getAllbyRegions/:region").get(getAllbyRegions);
router.route("/getById/:id").delete(removeFacility);
router.route("/facility/:id").patch(addRegion);


module.exports = router;