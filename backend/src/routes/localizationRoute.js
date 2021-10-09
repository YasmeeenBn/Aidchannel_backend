const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const localizationCtrl = require("../controllers/localizationController");
// add
router.post("/", localizationCtrl.addLocalization);
//delete
router.delete("/:id", localizationCtrl.deletelocalization);
// update
router.put("/:id", localizationCtrl.updatelocalization);
router.get(
  "/localizationOfProject/:id",
  localizationCtrl.getAllLocalizationByCountryAndProject
);
module.exports = router;
