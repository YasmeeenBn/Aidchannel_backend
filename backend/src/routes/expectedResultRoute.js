const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const expcResultCtrl = require("../controllers/expectedResultController");
// add expected result
router.post("/", expcResultCtrl.addExpected);
//delete expected result
router.delete("/:id", expcResultCtrl.deleteExpected);
// update expected result
router.put("/:id", expcResultCtrl.updateExpectedResult);
router.get(
  "/ExpectedResultsOfProject/:idProject",
  expcResultCtrl.getAllResultsByCountryAndProject
);

module.exports = router;
