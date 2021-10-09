const express = require("express");
const router = express.Router();

const activityCtrl = require("../controllers/activityController");

router.post("/", activityCtrl.add);
router.post("/getAcivityByoutcome", activityCtrl.getActivitiesByOutPut);
router.delete("/:activityId", activityCtrl.delete);
router.put("/:activityId", activityCtrl.update);

module.exports = router;
