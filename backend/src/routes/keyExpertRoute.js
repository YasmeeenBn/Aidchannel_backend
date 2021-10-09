const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const keyExpertCtrl = require("../controllers/keyExpertController");

 router.post("/", keyExpertCtrl.addKeyExpert);

 router.delete("/:id", keyExpertCtrl.deleteKeyExpert);

 router.put("/:id", keyExpertCtrl.updateKeyExpert);
 router.get(
   "/keyExpertOfProjects/:idProject",
   keyExpertCtrl.getAllKeyExpertsByCountryAndProject
 );
module.exports = router;
