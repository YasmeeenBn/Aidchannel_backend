var Interviewtypes = require("../models/interviewTypes");

exports.index = async (req, res, next) => {
  const interviewType = new Interviewtypes(req.body);
  let items = await interviewType.save();
  res.status(200).json(items);
};
exports.getAllInterviewTypes = async (req, res, next) => {
  try {
    let items = await Interviewtypes.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getOneInterviewTypesByName = async (req, res, next) => {
  const { name } = req.params;
  try {
    let interviewType = await Interviewtypes.findOne({ name: name });
    res.status(200).json(interviewType);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// exports.add = async (req, res, next) => {
//   let organizationtypes = new Organizationtypes({ name: "Advocacy NGO" });

//   let result = await organizationtypes.save();

//   res.status(201).json(result);
// };
