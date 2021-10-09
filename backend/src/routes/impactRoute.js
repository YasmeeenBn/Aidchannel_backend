const express = require("express");
const router = express.Router();

const impactCtrl = require("../controllers/impactController");

router.post("/", impactCtrl.add);
router.get("/:projectId", impactCtrl.getProjectImpacts);
router.put("/:impactId", impactCtrl.update);
router.delete("/:impactId", impactCtrl.delete);
router.delete("/deletegraph/:idProject", impactCtrl.deleteGraph);
router.get("/withAllData/:projectId", impactCtrl.getProjectImpactsAllData);

module.exports = router;
