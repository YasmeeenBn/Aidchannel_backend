const mongoose = require("mongoose");
var country = require("../models/country");
var localization = require("../models/localization");

exports.addLocalization = async (req, res, next) => {
  let localiz = new localization(req.body);
  try {
    await localiz.save();
    res.status(201).json(localiz);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deletelocalization = async (req, res, next) => {
  const id = req.params.id;
  try {
    await localization.deleteOne({ _id: id });
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.updatelocalization = async (req, res, next) => {
  const id = req.params.id;
  try {
    mongoose.set("useFindAndModify", false);
    localization.findByIdAndUpdate(id, req.body, function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "localization updated successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// get localization by country and project
exports.getAllLocalizationByCountryAndProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    let localizationOfProject = await localization.find({
      project_id: id,
    });
    res.status(200).json(localizationOfProject);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
