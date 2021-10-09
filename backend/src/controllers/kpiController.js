const mongoose = require("mongoose");
var country = require("../models/country");
var Kpi = require("../models/kpi");

// Kpi crud functions

exports.addKpi = async (req, res, next) => {
  let kpi = new Kpi(req.body);
  try {
    await kpi.save();
    res.status(201).json(kpi);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deleteKpi = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Kpi.deleteOne({ _id: id });
    res.status(200).json({ message: "Kpi deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.updateKpi = async (req, res, next) => {
  const id = req.params.id;

  try {
    mongoose.set("useFindAndModify", false);
    Kpi.findByIdAndUpdate(id, req.body, function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "Kpi updated successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// get expected results by country and project
exports.getAllKpisByCountryAndProject = async (req, res, next) => {
  const { idProjects } = req.params;

  try {
    let KpisOfProject = await Kpi.find({
      project_id: idProjects,
    });
    res.status(200).json(KpisOfProject);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
