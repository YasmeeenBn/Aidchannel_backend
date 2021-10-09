const express = require("express");
const router = express.Router();

const interview = require("../controllers/interviewController");
const uploadMulter = require("../middlewares/multer");

//return the list of test items
router.get(`/ByCodeCountry/:codeCountry`, interview.getAllInterviewByCountry);

router.post(`/ByCodeCountryPagination/:codeCountry`, interview.getAllInterviewByCountryPagination);

router.get("/", interview.index);
//insert new test item
router.post("/", uploadMulter.single("interviewImage"), interview.add);

router.get(
  "/getInterview/:idProject/:idTypeInterview",
  interview.getInterviewByProjectAndType
);

//delete interview
router.delete("/:id", interview.deleteInterview);

router.get("/:id", interview.getOne);

router.put("/:id",uploadMulter.single("interviewImage"), interview.updateInterview);

module.exports = router;
