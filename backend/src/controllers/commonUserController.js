const { request } = require("../app");
var user = require("../models/commonUser");

exports.getExpertsOfMonth = async (req, res, next) => {
  //url collecte n projets
  const expert_of_month = await user.find({ expert_of_month: true });
  res.status(200).json(expert_of_month);
};

exports.index = async (req, res, next) => {
  let items = await user
    .find()
    .sort({ fullname: 1 })
    .populate({ path: "country", model: "Country" });
  // .populate({ path: 'status', model: 'Status' })
  // .populate({ path: 'funder', model: 'Organization' });
  res.status(200).json(items);
};

exports.add = async (req, res, next) => {
  let newUser = new user(req.body.user);
  try {
    let userOut = await newUser.save();
    res.status(200).json(userOut);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    await user.remove({ _id: id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    const userData = await user
      .findById(id)
      .populate({ path: "country", model: "Country" });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.update = (req, res) => {
  user
    .findById(req.params.id)
    .then((userUp) => {
      (userUp.firstname = req.body.firstname),
        (userUp.lastname = req.body.lastname),
        (userUp.email = req.body.email),
        (userUp.password = req.body.password),
        (userUp.role = req.body.role),
        (userUp.country = req.body.country),
        userUp.save((err) => {
          if (err) {
            return res.status(404).json({
              error: "body request !!",
            });
          }
          res.json({
            user: userUp,
          });
        });
    })
    .catch((err) => console.log(err));
};
