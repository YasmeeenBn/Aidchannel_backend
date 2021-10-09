const express = require("express");
const router = express.Router();
const ExpertArticle = require("../controllers/ExpertArticleController");
const uploadMulter = require("../middlewares/multer");

router.post(
  `/ByCodeCountryPagination/:codeCountry`,
  ExpertArticle.getAllExpertArticleByCountryPagination
);

router.get("/", ExpertArticle.index);

//insert new test item
// router.post("/", uploadMulter.single("articleImage"), ExpertArticle.add);
router.post("/", uploadMulter.single("articleImage"), ExpertArticle.add);

//delete interview
router.delete("/:id", ExpertArticle.deleteExpertArticle);

router.get("/:id", ExpertArticle.getOne);
router.get("/articleByExpert/:id", ExpertArticle.getExpertArticleByIdExpert);

router.put(
  "/:id",
  uploadMulter.single("articleImage"),
  ExpertArticle.updateExpertArticle
);

module.exports = router;
