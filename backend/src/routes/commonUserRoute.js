const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/commonUserController");

//return the list of test items
router.get("/", userCtrl.index);
//insert new test item
router.post("/", userCtrl.add);
router.delete("/:id", userCtrl.delete);
router.get("/:id", userCtrl.getOne);
router.put("/:id", userCtrl.update);

router.get("/expertOfMonth", userCtrl.getExpertsOfMonth);

module.exports = router;
