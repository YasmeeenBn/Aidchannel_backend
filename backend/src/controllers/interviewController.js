const mongoose = require("mongoose");
const { populate } = require("../models/interview");
var Interview = require("../models/interview");
var country = require("../models/country");

// get countries
exports.index = async (req, res, next) => {
  let items = await Interview.find();
  res.status(200).json(items);
};

exports.getAllInterviewByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let InterviewByCountry = await Interview.find({
      country: findCountry._id,
    })
      .sort({ _id: 1 })
      .populate("country")
      .populate("type_interview")
      .populate("project", "_id name");
    res.status(200).json(InterviewByCountry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllInterviewByCountryPagination = async (req, res, next) => {
  const { codeCountry } = req.params;
  const { limit = 9, page = 1 } = req.query;
  const { searchText } = req.body;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let InterviewByCountry = await Interview.find({
      country: findCountry._id,
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate("country")
      .populate("type_interview")
      .populate("project", "_id name");

    let count = await Interview.countDocuments({
      country: findCountry._id,
      //name: { $regex: new RegExp(req.body.searchText, "i") },
    });

    res
      .status(200)
      .json({ data: InterviewByCountry, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getInterviewByProjectAndType = async (req, res, next) => {
  const { idProject, idTypeInterview } = req.params;

  try {
    let interview = await Interview.findOne({
      type_interview: idTypeInterview,
      project: idProject,
    });

    res.status(200).json(interview);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.add = async (req, res, next) => {
  try {
    var int_save = new Interview(req.body);
    if (req.file) int_save.interviewImage = req.file.path;

    let int_out = await int_save.save();
    res.status(200).json(int_out);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteInterview = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Interview.deleteOne({ _id: id });
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    const org = await Interview.findById(id)
      .populate("type_interview")
      .populate("project");
    res.status(200).json(org);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateInterview = async (req, res, next) => {
  const id = req.params.id;
  if (req.file != undefined) req.body.interviewImage = req.file.path;
  mongoose.set("useFindAndModify", false);
  Interview.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "Interview updated successfully",
      });
    }
  });
};
