const mongoose = require("mongoose");
const Activity = require("../models/activity");
const OutPut = require("../models/outPut");

exports.add = async (req, res, next) => {
  const output = req.body;
  try {
    const newOutPut = new OutPut(output);
    await newOutPut.save();
    return res.status(200).json(newOutPut);
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.getOutPuts = async (req, res, next) => {
  const { outcomesIds } = req.body;

  try {
    const outputs = await OutPut.find({ outComes: { $in: outcomesIds } });
    return res.status(200).json({ outputs });
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.update = async (req, res, next) => {
  const { OutPutId } = req.params;
  const output = req.body;

  try {
    mongoose.set("useFindAndModify", false);
    OutPut.findByIdAndUpdate(
      OutPutId,
      output,
      { new: true },
      function (err, output) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json(output);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.delete = async (req, res, next) => {
  const { outputId } = req.params;

  try {
    const activities = await Activity.find({ outPuts: { $in: outputId } });
    activities.map(async (activity) => {
      const outputs = activity.outPuts.filter((output) => {
        if (output._id == outputId) return false;
        return true;
      });
      if (outputs.length === 0) {
        await Activity.deleteOne({ _id: activity._id });
      } else {
        mongoose.set("useFindAndModify", false);
        Activity.findByIdAndUpdate(
          activity._id,
          { outPuts: outputs },
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

    await OutPut.deleteOne({ _id: outputId });
    res.status(200).json({ msg: "output deleted succssfuly" });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};
