const mongoose = require("mongoose");
const outCome = require("../models/outCome");
const OutCome = require("../models/outCome");
const OutPut = require("../models/outPut");

exports.add = async (req, res, next) => {
  const outcome = req.body;
  try {
    const newOutCome = new OutCome(outcome);
    await newOutCome.save();
    return res.status(200).json(newOutCome);
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.getImpactOutcomes = async (req, res, next) => {
  const { impactsIds } = req.body;

  try {
    const outcomes = await OutCome.find({ impacts: { $in: impactsIds } });
    return res.status(200).json({ outcomes });
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.update = async (req, res, next) => {
  const { outComeId } = req.params;
  const outcome = req.body;

  try {
    mongoose.set("useFindAndModify", false);
    OutCome.findByIdAndUpdate(
      outComeId,
      outcome,
      { new: true },
      function (err, outcome) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json(outcome);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.delete = async (req, res, next) => {
  const { outcomeId } = req.params;

  try {
    const outputs = await OutPut.find({ outComes: { $in: outcomeId } });
    outputs.map(async (output) => {
      const outcomes = output.outComes.filter((outcome) => {
        if (outcome._id == outcomeId) return false;
        return true;
      });
      if (outcomes.length === 0) {
        await OutPut.deleteOne({ _id: output._id });
      } else {
        mongoose.set("useFindAndModify", false);
        OutPut.findByIdAndUpdate(
          output._id,
          { outComes: outcomes },
          { new: true },
          function (err, output) {
            if (err) {
              res.status(500).json({ error: err });
              console.log(err);
            }
          }
        );
      }
    });

    await OutCome.deleteOne({ _id: outcomeId });
    res.status(200).json({ msg: "outcome deleted succssfuly" });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};
