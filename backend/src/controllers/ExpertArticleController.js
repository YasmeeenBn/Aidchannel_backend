const mongoose = require("mongoose");
const { populate } = require("../models/ExpertArticle");
var ExpertArticle = require("../models/ExpertArticle");
var country = require("../models/country");

exports.index = async (req, res, next) => {
  let items = await ExpertArticle.find();
  res.status(200).json(items);
};

exports.getAllExpertArticleByCountryPagination = async (req, res, next) => {
  const { codeCountry } = req.params;
  const { limit = 9, page = 1 } = req.query;
  const { searchText } = req.body;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ExpertArticleByCountry = await ExpertArticle.find({
      country: findCountry._id,
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate("country")
      .populate("user2");

    let count = await ExpertArticle.countDocuments({
      country: findCountry._id,
    });

    res
      .status(200)
      .json({ data: ExpertArticleByCountry, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.add = async (req, res, next) => {
  if (req.file != undefined) req.body.articleImage = req.file.path;
  try {
    var int_save = new ExpertArticle(req.body);
    // if (req.file) int_save.articleImage = req.file.path;
    let int_out = await int_save.save();
    res.status(200).json(int_out);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteExpertArticle = async (req, res, next) => {
  const id = req.params.id;
  try {
    await ExpertArticle.deleteOne({ _id: id });
    res.status(200).json({ message: "Expert's Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    const art = await ExpertArticle.findOne({ expert: id })
      .populate("country")
      .populate("expert");
    res.status(200).json(art);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getExpertArticleByIdExpert = async (req, res, next) => {
  const id = req.params.id;
  try {
    const art = await ExpertArticle.findOne({ expert: id }).populate("expert");
    res.status(200).json(art);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateExpertArticle = async (req, res, next) => {
  const id = req.params.id;
  if (req.file != undefined) req.body.articleImage = req.file.path;

  mongoose.set("useFindAndModify", false);
  ExpertArticle.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "Expert's Article updated successfully",
      });
    }
  });
};
