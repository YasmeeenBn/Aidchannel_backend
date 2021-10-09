const express = require("express");
const router = express.Router();

const outComeCtrl = require("../controllers/outComeController");

router.post("/", outComeCtrl.add);
router.post("/getOutcomeByImpacts", outComeCtrl.getImpactOutcomes);
router.delete("/:outcomeId", outComeCtrl.delete);
router.put("/:outComeId", outComeCtrl.update);

module.exports = router;
