const express = require("express");
const router = express.Router();

const { createMember, getToursite} = require("../controllers/memberController");


router.route("/member").get(getToursite);
router.route("/member").post(createMember);

module.exports = router;