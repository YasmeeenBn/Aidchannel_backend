const mongoose = require("mongoose");
var country = require("../models/country");
var MainBeneficiary = require("../models/mainBeneficiaries");

// MainBeneficiary crud functions

exports.addMainBeneficiary = async (req, res, next) => {
  let mainBeneficiary = new MainBeneficiary(req.body);
  try {
    await mainBeneficiary.save();
    res.status(201).json(mainBeneficiary);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deleteMainBeneficiary = async (req, res, next) => {
  const id = req.params.id;
  try {
    await MainBeneficiary.deleteOne({ _id: id });
    res.status(200).json({ message: "MainBeneficiary deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.updateMainBeneficiary = async (req, res, next) => {
  const id = req.params.id;

  try {
    mongoose.set("useFindAndModify", false);
    MainBeneficiary.findByIdAndUpdate(id, req.body, function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "MainBeneficiary updated successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// get expected results by country and project
exports.getAllmainBeneficiariesByProject = async (req, res, next) => {
  const { idProject } = req.params;

  try {
    let MainBeneficiaryOfProject = await MainBeneficiary.find({
      project_id: idProject,
    });
    res.status(200).json(MainBeneficiaryOfProject);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
