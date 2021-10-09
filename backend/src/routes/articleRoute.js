const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const newCtrl = require("../controllers/articleController");
router.get(
  "/articlesByCountry/:codeCountry",
  newCtrl.getAllArticlesByCountryPagination
);
// accept article web master
router.put("/acceptArticle/:articleId", newCtrl.acceptArticle);

//refuse article web master
router.put("/refuseArticle/:articleId", newCtrl.refuseVideo);
// getting all articles accepted by web master
router.get("/ArticlesAccepted/:codeCountry", newCtrl.getAllArticlesAccepted);
// search by keyword 
router.post("/searchByKeyword", newCtrl.SearchByKeyword);
router.get(
  "/numberByCodeCountry/:codeCountry",
  newCtrl.getNumberArticlesByCountry
);
router.post("/articlesOfCountry", newCtrl.getArticlesScrolling);
module.exports = router;
