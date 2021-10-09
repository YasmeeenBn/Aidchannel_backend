const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const kpictrl = require("../controllers/kpiController");

router.post("/", kpictrl.addKpi);

router.delete("/:id", kpictrl.deleteKpi);

router.put("/:id", kpictrl.updateKpi);
router.get(
  "/KpisOfProject/:idProjects",
  kpictrl.getAllKpisByCountryAndProject
);
module.exports = router;
