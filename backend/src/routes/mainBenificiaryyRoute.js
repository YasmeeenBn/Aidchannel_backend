const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const mainBnfCtrl = require("../controllers/mainBeneficiariesController");

router.post("/", mainBnfCtrl.addMainBeneficiary);

router.delete("/:id", mainBnfCtrl.deleteMainBeneficiary);

router.put("/:id", mainBnfCtrl.updateMainBeneficiary);
router.get(
  "/MainBeneficiaryOfProject/:idProject",
  mainBnfCtrl.getAllmainBeneficiariesByProject
);
module.exports = router;
