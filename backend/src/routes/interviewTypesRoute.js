const express = require("express");
const router = express.Router();

const interviewtypesCtrl = require("../controllers/interviewtypesController");

//return the list of test items
router.post("/", interviewtypesCtrl.index);
router.get("/", interviewtypesCtrl.getAllInterviewTypes);
router.get("/:name", interviewtypesCtrl.getOneInterviewTypesByName);
//insert new test item
// router.post("/", organizationtypesCtrl.add);

module.exports = router;
