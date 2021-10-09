const mongoose = require("mongoose");
var country = require("../models/country");
// var expectedResult = require("../models/expectedResult");
var expectedResult = require("../models/expectedResult");
// expected results crud functions
exports.addExpected = async (req, res, next) => {
  let expResult = new expectedResult(req.body);
  try {
    await expResult.save();
    res.status(201).json(expResult);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deleteExpected = async (req, res, next) => {
  const id = req.params.id;
  try {
    await expectedResult.deleteOne({ _id: id });
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateExpectedResult = async (req, res, next) => {
  const id = req.params.id;

  try {
    mongoose.set("useFindAndModify", false);
    expectedResult.findByIdAndUpdate(id, req.body, function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "Expected updated successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// get expected results by country and project
exports.getAllResultsByCountryAndProject = async (req, res, next) => {
  const { idProject } = req.params;
  // const { idProject } = req.params;
  try {
    let ExpectedResultOfProject = await expectedResult.find({
      project_id: idProject,
    });
    res.status(200).json(ExpectedResultOfProject);
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};
