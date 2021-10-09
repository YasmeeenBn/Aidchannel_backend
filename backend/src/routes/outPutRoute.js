const express = require("express");
const router = express.Router();

const outPutCtrl = require("../controllers/outPutController");

router.post("/", outPutCtrl.add);
router.post("/getOutputByoutcome", outPutCtrl.getOutPuts);
router.delete("/:outputId", outPutCtrl.delete);
router.put("/:OutPutId", outPutCtrl.update);

module.exports = router;
