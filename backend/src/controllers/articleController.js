const article = require("../models/news");
const country = require("../models/country");
const mongoose = require("mongoose");
const countrycode = require("../models/country");

exports.getAllArticlesByCountryPagination = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let articlesByCountry = await article
      .find({
        country: findCountry._id,
        validation: 0,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ posted_at: -1 });
    res.status(200).json({
      data: articlesByCountry,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// accept an article
exports.acceptArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const filter = { _id: articleId };
  const update = { validation: 1 };

  try {
    let Art = await article.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(Art);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
// refuse an article
exports.refuseVideo = async (req, res, next) => {
  const { articleId } = req.params;
  const filter = { _id: articleId };
  const update = { validation: 2 };

  try {
    let art = await article.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(art);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getAllArticlesAccepted = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let articlesByCountry = await article
      .find({
        country: findCountry._id,
        validation: 1,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ posted_at: -1 });
    res.status(200).json({
      data: articlesByCountry,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.SearchByKeyword = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;
  const { code } = req.body;

  let countrycode = await country.find({ code: code.toUpperCase() });

  try {
    const articles = await article
      .find({
        article_title: { $nin: [null, ""] },
        country: countrycode[0]._id,
        article_title: { $regex: new RegExp(req.body.searchText, "i") },
        validation: 1,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ posted_at: -1 });

    res.status(200).json({
      data: articles,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getNumberArticlesByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });
    let numberArticles = await article.countDocuments({
      country: findCountry._id,
    });
    res.status(200).json(numberArticles);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getArticlesScrolling = async (req, res, next) => {
  //url collecte n projets
  const { limit = 9, page = 1 } = req.query;
  const { code } = req.body;

  let countrycode = await country.find({ code: code.toUpperCase() });
  const articles = await article
    .find({
      country: countrycode[0]._id,
      article_title: { $regex: new RegExp(req.body.searchText, "i") },
      validation: 1,
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.status(200).json({ data: articles, page: page });
};