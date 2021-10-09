const mongoose = require("mongoose");
var country = require("../models/country");
var KeyExpert = require("../models/keyExpert");

// KeyExpert crud functions

exports.addKeyExpert = async (req, res, next) => {
  let keyExpert = new KeyExpert(req.body);
  try {
    await keyExpert.save();
    res.status(201).json(keyExpert);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deleteKeyExpert = async (req, res, next) => {
  const id = req.params.id;
  try {
    await KeyExpert.deleteOne({ _id: id });
    res.status(200).json({ message: "KeyExpert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.updateKeyExpert = async (req, res, next) => {
  const id = req.params.id;

  try {
    mongoose.set("useFindAndModify", false);
    KeyExpert.findByIdAndUpdate(id, req.body, function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "KeyExpert updated successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllKeyExpertsByCountryAndProject = async (req, res, next) => {
  const { idProject } = req.params;

  try {
    let KeyExpertsOfProject = await KeyExpert.find({
      project_id: idProject,
    });
    res.status(200).json(KeyExpertsOfProject);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
