const mongoose = require("mongoose");
const Activity = require("../models/activity");

exports.add = async (req, res, next) => {
  const activity = req.body;
  try {
    const newActivity = new Activity(activity);
    await newActivity.save();
    return res.status(200).json(newActivity);
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.getActivitiesByOutPut = async (req, res, next) => {
  const { activitiesIds } = req.body;

  try {
    const activities = await Activity.find({ outPuts: { $in: activitiesIds } });
    return res.status(200).json({ activities });
  } catch (error) {
    return res.status(505).json({ error });
  }
};

exports.update = async (req, res, next) => {
  const { activityId } = req.params;
  const activity = req.body;

  try {
    mongoose.set("useFindAndModify", false);
    Activity.findByIdAndUpdate(
      activityId,
      activity,
      { new: true },
      function (err, activity) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json(activity);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.delete = async (req, res, next) => {
  const { activityId } = req.params;

  try {
    await Activity.deleteOne({ _id: activityId });
    res.status(200).json({ msg: "activity deleted succssfuly" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
