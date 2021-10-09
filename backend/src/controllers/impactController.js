const mongoose = require("mongoose");
const activity = require("../models/activity");
const Impact = require("../models/impact");
const outCome = require("../models/outCome");
const outPut = require("../models/outPut");

exports.add = async (req, res, next) => {
  const impact = req.body;
  try {
    const newImpact = new Impact(impact);
    await newImpact.save();
    return res.status(200).json(newImpact);
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.getProjectImpacts = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const impacts = await Impact.find({ project: projectId });
    return res.status(200).json({ impacts });
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.getProjectImpactsAllData = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    let impacts = await Impact.find({ project: projectId });

    for (let i = 0; i < impacts.length; i++) {
      let outcomes = await outCome.find({ impact: impacts[i]._id });
      for (let j = 0; j < outcomes.length; j++) {
        let outputs = await outPut.find({ outCome: outcomes[j]._id });
        for (let k = 0; k < outputs.length; k++) {
          let activities = await activity.find({ outPut: outputs[k]._id });
          outputs[k] = { ...outputs[k]._doc, activities };
        }
        outcomes[j] = { ...outcomes[j]._doc, outputs };
      }

      impacts[i] = { ...impacts[i]._doc, outcomes };
    }

    return res.status(200).json(impacts);
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.update = async (req, res, next) => {
  const { impactId } = req.params;
  const impact = req.body;

  try {
    mongoose.set("useFindAndModify", false);
    Impact.findByIdAndUpdate(
      impactId,
      impact,
      { new: true },
      function (err, impact) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json(impact);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.delete = async (req, res, next) => {
  const { impactId } = req.params;

  try {
    const outcomes = await outCome.find({ impacts: { $in: impactId } });
    outcomes.map(async (outcome) => {
      const impacts = outcome.impacts.filter((impact) => {
        if (impact._id == impactId) return false;
        return true;
      });
      if (impacts.length === 0) {
        await OutCome.deleteOne({ _id: outcome._id });
      } else {
        mongoose.set("useFindAndModify", false);
        OutCome.findByIdAndUpdate(
          outcome._id,
          { impacts: impacts },
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

    await Impact.deleteOne({ _id: impactId });
    res.status(200).json({ msg: "Impact deleted succssfuly" });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

exports.deleteGraph = async (req, res, next) => {
  const { idProject } = req.params;

  try {
    //await Impact.deleteOne({ _id: impactId });
    const impactsIds = await (
      await Impact.find({ project: idProject }, { _id: 1 })
    ).map((impact) => impact._id);

    const outcomesIds = await (
      await outCome.find({ impacts: { $in: impactsIds } }, { _id: 1 })
    ).map((outcome) => outcome._id);

    const outputsIds = await (
      await outPut.find({ outComes: { $in: outcomesIds } })
    ).map((output) => output._id);

    const activitiesIds = await (
      await activity.find({ outPuts: { $in: outputsIds } })
    ).map((activity) => activity._id);

    await activity.deleteMany({ _id: { $in: activitiesIds } });
    await outPut.deleteMany({ _id: { $in: outputsIds } });
    await outCome.deleteMany({ _id: { $in: outcomesIds } });
    await Impact.deleteMany({ _id: { $in: impactsIds } });

    res.status(200).json(activitiesIds);
  } catch (error) {
    res.status(500).json({ error });
  }
};
