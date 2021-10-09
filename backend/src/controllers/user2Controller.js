const { request } = require("../app");
var user2 = require("../models/user2");
var country = require("../models/country");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const { hashPwd, userHelper } = require("../helpers/UserHelper");
const Invitation = require("../models/linkedin/invitation");
const fetch = require("node-fetch");

const qs = require("query-string");

const axios = require("axios");
const router = express.Router();
/////authentification Linkedin///////////////////////
const urlToGetLinkedInAccessToken =
  "https://www.linkedin.com/oauth/v2/accessToken";
const urlToGetUserProfile =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))";
const urlToGetUserEmail =
  "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))";

 exports.getCredentials=(req, res) =>{
  const user = {};
  const code = req.query.code;
  const accessToken = getAccessToken(code);
  console.log(accessToken);
  const userProfile = getUserProfile(accessToken);
  console.log(userProfile);
  const userEmail = getUserEmail(accessToken);
  console.log(userEmail);
  let resStatus = 400;
  if (!(accessToken === null || userProfile === null || userEmail === null)) {
    user = userBuilder(userProfile, userEmail);
    resStatus = 200;
  }
  // Here, you can implement your own login logic
  // to authenticate new user or register him
  res.status(resStatus).json({ user });
};
function getAccessToken(code) {
  let accessToken = null;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const parameters = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
  axios
    .post(urlToGetLinkedInAccessToken, qs.stringify(parameters), config)
    .then((response) => {
      accessToken = response.data["access_token"];
    })
    .catch((err) => {
      console.log("Error getting LinkedIn access token");
    });
  return accessToken;
}

function getUserProfile(accessToken) {
  let userProfile = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  axios
    .get(urlToGetUserProfile, config)
    .then((response) => {
      userProfile.firstName = response.data["localizedFirstName"];
      userProfile.lastName = response.data["localizedLastName"];
      userProfile.profileImageURL =
        response.data.profilePicture[
          "displayImage~"
        ].elements[0].identifiers[0].identifier;
      // I mean, couldn't they have burried it any deeper?
    })
    .catch((error) => console.log("Error grabbing user profile"));
  return userProfile;
}


function getUserEmail(accessToken) {
  const email = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  axios
    .get(urlToGetUserEmail, config)
    .then((response) => {
      email = response.data.elements[0]["handle~"];
    })
    .catch((error) => console.log("Error getting user email"));

  return email;
}

function userBuilder(userProfile, userEmail) {
  return {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    profileImageURL: userProfile.profileImageURL,
    email: userEmail,
  };
}










exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await user2.findOne({ email });
    if (!user) throw Error("User not found");
    if (user) {
      const auth = await userHelper.comparePasswords(password, user.password);
      if (auth) {
        return userHelper.GenerateTokenAndSendResp(res, user._doc);
      }
      throw Error("Incorrect password");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.LinkedInController = (req, res) => {
  console.log("Linkedin LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://www.linkedin.com/oauth/v2/${userID}/?fields=id,fullname,email&accessToken=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, fullname } = response;
        user2.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, fullname, role } = data;
            return res.json({
              token,
              user: { _id, email, fullname, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new user2({ fullname, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR Linkedin LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with Linkedin",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, fullname, role } = data;
              return res.json({
                token,
                user: { _id, email, fullname, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Linkedin login failed. Try later",
        });
      })
  );
};
exports.register = async (req, res) => {
  if (req.file != undefined) req.body.image_url = req.file.path;
  req.body.linkedin = true;
  const userData = req.body;

  try {
    const isUserExist = await user2.findOne({ email: userData.email });
    if (isUserExist) return res.status(400).json({ error: "THis user exist" });
    const newUser = new user2({
      ...userData,
      password: await hashPwd(userData.password),
    });
    const savedUser = await newUser.save();

    if (!savedUser) throw Error("CANNOT CREATE USER");

    //   await sendSuccessEmailRegister(userData.email)
    res = userHelper.GenerateTokenAndSendResp(res, {
      ...savedUser._doc,
      password: undefined,
    });
    return res;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({
    message: "user logout",
  });
};

exports.getExpertsOfMonth = async (req, res, next) => {
  //url collecte n projets
  const { limit = 9, page = 1 } = req.query;
  const expert_of_month = await user2
    .find({
      expert_of_month: true,
      fullname: { $regex: new RegExp(req.body.searchText, "i") },
    })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.status(200).json({ data: expert_of_month, page: page });
};

exports.getExpertDetails = async (req, res, next) => {
  //get project id from URL
  const _id = req.params.expert_id;

  const expert_find = await user2
    .findById(_id)
    .populate({ path: "country", model: "Country" });

  res.status(200).json(expert_find);
};

exports.getCop = async (req, res, next) => {
  const cops = await user2.find({
    cop: true,
  });

  res.status(200).json(cops);
};

exports.expertDetailData = async (req, res, next) => {
  //get expert id from URL
  const _id = req.params.expert_id;
  const expert_find = await user2.findById(_id);
  // .populate({ path: "country", model: "Country" })
  // .populate({ path: "status", model: "Status" })
  // .populate({ path: "thematique", model: "Thematiques" });
  res.status(200).json(expert_find);
};

exports.index = async (req, res, next) => {
  let items = await user2.find().sort({ fullname: 1 });
  // .populate({ path: 'status', model: 'Status' })
  // .populate({ path: 'funder', model: 'Organization' });
  res.status(200).json(items);
};

exports.add = async (req, res, next) => {
  // let status = new status({ name: "Advocacy NGO" });
  // let result = await status.save();
  // console.log(req.body);
  var user2_in = req.body.user2; //donnees venues
  var user2_save = new user2(user2_in);
  let user2_out = await user2_save.save();
  res.status(201).json(user2_out);
};
// add expert
exports.addExpert = async (req, res, next) => {
  req.body.role = 3;
  if (req.file != undefined) req.body.image_url = req.file.path;
  const expert = new user2(req.body);
  try {
    await expert.save();
    res.status(201).json(expert);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// add normal user
exports.addUser = async (req, res, next) => {
  req.body.added_webmaster = 1;

  if (req.file != undefined) req.body.image_url = req.file.path;
  const user = new user2(req.body);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    await user2.deleteOne({ _id: id });
    res.status(200).json({ message: "WebMaster deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllUsers = async (req, res, next) => {
  let user = await user2.find().sort({ name: 1 });
  res.status(200).json({ data: user });
  res.status(200).json(user);
};

exports.deleteExpert = async (req, res, next) => {
  const id = req.params.id;

  try {
    await user2.deleteOne({ _id: id });
    res.status(200).json({ message: "Expert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.updateExpert = async (req, res, next) => {
  const id = req.params.id;
  if (req.file != undefined) req.body.image_url = req.file.path;
  mongoose.set("useFindAndModify", false);
  user2.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "Expert updated successfully",
      });
    }
  });
};
exports.getAllExpertsByCountry = async (req, res, next) => {
  try {
    let ExpertByCountry = await user2.find({
      role: 3,
    });
    res.status(200).json(ExpertByCountry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllExpertsByCountryPagination = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;

  try {
    let expertByCountry = await user2
      .find(
        {
          role: 3,
          fullname: { $regex: new RegExp(req.body.searchText, "i") },
        },
        {
          _id: 1,
          fullname: 1,
          email: 1,
          phone: 1,
          expert_of_month: 1,
          image_url: 1,
        }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]]);
    let count = await user2.countDocuments({
      role: 3,
      fullname: { $regex: new RegExp(req.body.searchText, "i") },
    });

    res
      .status(200)
      .json({ data: expertByCountry, page: page, totalCount: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
exports.getAllHeadExpertsIdAndName = async (req, res, next) => {
  try {
    let items = await user2.find();

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.enableExpertOfMonth = async (req, res, next) => {
  const id = req.params.expertId;

  mongoose.set("useFindAndModify", false);
  user2.findByIdAndUpdate(id, { expert_of_month: true }, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "expert updated successfully",
      });
    }
  });
};
exports.disabledExpertOfMonth = async (req, res, next) => {
  const id = req.params.expertId;

  mongoose.set("useFindAndModify", false);
  user2.findByIdAndUpdate(id, { expert_of_month: false }, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "expert updated successfully",
      });
    }
  });
};

exports.addWebmaster = async (req, res, next) => {
  req.body.role = 1;
  console.log(req.body);
  if (req.file != undefined) req.body.image_url = req.file.path;
  const webmaster = new user2(req.body);
  try {
    await webmaster.save();
    res.status(201).json(webmaster);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteWebmaster = async (req, res, next) => {
  const id = req.params.id;
  try {
    await user2.deleteOne({ _id: id });
    res.status(200).json({ message: "WebMaster deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllwebmasters = async (req, res, next) => {
  const webmaster = await user2
    .find({
      role: 1,
    })
    .populate({ path: "country", model: "Country" });
  res.status(200).json({ data: webmaster });
};

exports.getOneWebmaster = async (req, res, next) => {
  const id = req.params.id;
  try {
    const webmaster = await user2.findById(id).populate("country");

    res.status(200).json(webmaster);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateWebmaster = async (req, res, next) => {
  const id = req.params.id;
  if (req.file != undefined) req.body.image_url = req.file.path;
  mongoose.set("useFindAndModify", false);
  user2.findByIdAndUpdate(id, req.body, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "Webmaster updated successfully",
      });
    }
  });
};

exports.getNumberExpertsByCountry = async (req, res, next) => {
  try {
    let numberExperts = await user2.countDocuments({ role: 3 });
    res.status(200).json(numberExperts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getAddedUsersByWebmaster = async (req, res, next) => {
  try {
    let Users = await user2.find({
      added_webmaster: 1,
    });
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllWebMastersPagination = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;

  try {
    let users = await user2
      .find(
        {
          role: 1,
          fullname: { $regex: new RegExp(req.body.searchText, "i") },
        },
        {
          _id: 1,
          fullname: 1,
          email: 1,
          phone: 1,
          expert_of_month: 1,
          image_url: 1,
          adress: 1,
        }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate({ path: "country", model: "Country" });
    let count = await user2.countDocuments({
      role: 1,

      fullname: { $regex: new RegExp(req.body.searchText, "i") },
    });

    res.status(200).json({ data: users, page: page, totalCount: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
exports.getAddedUsersByWebmasterPagination = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;

  try {
    let users = await user2
      .find(
        {
          added_webmaster: 1,
          role: 2,
          fullname: { $regex: new RegExp(req.body.searchText, "i") },
        },
        {
          _id: 1,
          fullname: 1,
          email: 1,
          phone: 1,
          expert_of_month: 1,
          image_url: 1,
          adress: 1,
        }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]]);
    let count = await user2.countDocuments({
      added_webmaster: 1,
      role: 2,
      fullname: { $regex: new RegExp(req.body.searchText, "i") },
    });

    res.status(200).json({ data: users, page: page, totalCount: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

/////////////////////////LINKEDIN///////////////////

exports.getLinkedinUsersRecommandation = async (req, res, next) => {
  try {
    const idUser = req.user._id;

    // Users you've sent a friend request to before
    let invitationsFriendRequest = await Invitation.find({
      $or: [{ sender: idUser }, { recever: idUser }],
    });

    let usersFriendRequestIds = invitationsFriendRequest.map((invitation) => {
      if (String(invitation.sender) == String(idUser))
        return invitation.recever;
      else if (String(invitation.recever) == String(idUser))
        return invitation.sender;
    });
    // add the id of the logged in user himself
    usersFriendRequestIds = [
      ...usersFriendRequestIds,
      idUser,
      ...req.user.connections,
    ];

    let users = await user2.find({
      linkedin: true,
      _id: { $nin: usersFriendRequestIds },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getOneUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await user2.findById(userId).populate("connections");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
