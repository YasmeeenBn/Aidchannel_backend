const mongoose = require("mongoose");
const { request } = require("../app");
var project = require("../models/projectpreprod");
var country = require("../models/country");
var thematique = require("../models/thematiques");
var status = require("../models/status");
const countrycode = require("../models/country");
const organizationtype = require("../models/organizationtypes");
const Organization = require("../models/organization");
// get project by code
exports.project_by_id = async (req, res, next) => {
  let item = await Project.findOne({ id: req.params.id.toUpperCase() });
  res.status(200).json(item);
  console.log(item);
};

// get project by code
exports.project_by_id_v2 = async (req, res, next) => {
  let item = await project.findById(req.params.id);
  res.status(200).json(item);
};
// search bykey word
exports.searchByKeyword = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;
  const { code } = req.body;
  let countrycode = await country.find({ code: code.toUpperCase() });
  try {
    const projects = await project
      .find({
        name: { $nin: [null, ""] },
        country: countrycode[0]._id,
        validation: 1,
        name: { $regex: new RegExp(req.body.searchText, "i") },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ approval_date: 1 })
      .populate({ path: "country", model: "Country" })
      .populate({ path: "status", model: "Status" })
      .populate({ path: "thematique", model: "Thematiques" });

    res.status(200).json({
      data: projects,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAFDBProjectsOfMonth = async (req, res, next) => {
  //url collecte n projets
  const { limit = 9, page = 1 } = req.query;
  const project_of_month = await project
    .find({
      project_of_month: true,
      name: { $regex: new RegExp(req.body.searchText, "i") },
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" });
  res.status(200).json({ data: project_of_month, page: page });
};

// exports.index = async (req, res, next) => {
//   const { code } = req.body;
//   console.log({ code });
//   let items = await project
//     .find({ name: { $nin: [null, ""] } })
//     .sort({ approval_date: 1 })
//     .limit(10)
//     .populate({ path: "country", model: "Country" })
//     .populate({ path: "status", model: "Status" })
//     .populate({ path: "thematique", model: "Thematiques" })
//     .then((result) => {
//       res.status(200).json(result);
//     })
//     .catch((er) => {
//       console.log({ er });
//     });
// };

// exports.indexPost = async (req, res, next) => {
//   const { code } = req.body;
//   console.log({ code });
//   let countrycode = await country.find({ code: code.toUpperCase() });
//   let items = await project
//     .find({ name: { $nin: [null, ""] }, country: countrycode[0]._id })
//     .sort({ approval_date: 1 })
//     .limit(10)
//     .populate({ path: "country", model: "Country" })
//     .populate({ path: "status", model: "Status" })
//     .populate({ path: "thematique", model: "Thematiques" })
//     .then((result) => {
//       res.status(200).json(result);
//     })
//     .catch((er) => {
//       console.log({ er });
//     });
// };
exports.projectDetailData = async (req, res, next) => {
  //get project id from URL
  const _id = req.params.project_id;

  const project_find = await project
    .findById(_id)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" })
    .populate({ path: "funder", model: "Organization" })
    .populate({ path: "sub_funder", model: "Organization" })
    .populate({ path: "implementer", model: "Organization" })
    .populate({ path: "sub_implementer", model: "Organization" })
    .populate({ path: "task_manager", model: "User" });

  res.status(200).json(project_find);
};

exports.projectsByOrg = async (req, res, next) => {
  try{
  //get project id from URL
  const { limit = 9, page = 1, search="", count="", org, type="funder"} = req.query;
  console.log(new RegExp(search, "i"))
  console.log(search)
  // const thematic = req.params.thematic;
  const counts  = await country.find({code:count})
  if(type=="funder"){
    const project_find = await project
    .find({funder:org, country:counts,name: { $regex: new RegExp(search, "i") },
  })
  .limit(limit * 1)
  .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" })
    .populate({ path: "funder", model: "Organization" })
    .populate({ path: "sub_funder", model: "Organization" })
    .populate({ path: "implementer", model: "Organization" })
    .populate({ path: "sub_implementer", model: "Organization" })
    .populate({ path: "task_manager", model: "User" });
    console.log(project_find.length)
  res.status(200).json({ data: project_find, page : page});
  }
  else{
    const project_find = await project
    .find({implementer:org, country:counts,name: { $regex: new RegExp(search, "i") },
  })
  .limit(limit * 1)
  .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" })
    .populate({ path: "funder", model: "Organization" })
    .populate({ path: "sub_funder", model: "Organization" })
    .populate({ path: "implementer", model: "Organization" })
    .populate({ path: "sub_implementer", model: "Organization" })
    .populate({ path: "task_manager", model: "User" });
    console.log(project_find.length)
  res.status(200).json({ data: project_find, page : page});
  }
  }
  catch(e){
    console.log(e)
  }
};

exports.projectsByCountryThematic = async (req, res, next) => {
  try{
  //get project id from URL
  const { limit = 9, page = 1, search="", count="", thematic="" } = req.query;
  console.log(new RegExp(search, "i"))
  console.log(search)
  // const thematic = req.params.thematic;
  const counts  = await country.find({code:count})
  
  const project_find = await project
    .find({thematique:thematic, country:counts,name: { $regex: new RegExp(search, "i") },
  })
  .limit(limit * 1)
  .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" })
    .populate({ path: "funder", model: "Organization" })
    .populate({ path: "sub_funder", model: "Organization" })
    .populate({ path: "implementer", model: "Organization" })
    .populate({ path: "sub_implementer", model: "Organization" })
    .populate({ path: "task_manager", model: "User" });
    console.log(project_find.length)
  res.status(200).json({ data: project_find, page : page});}
  catch(e){
    console.log(e)
  }
};

exports.getlastproject = async (req, res, next) => {
  let items = await project.findById("60d5dfdbcaf493156c1eb46f");
  res.status(200).json(items);
};

exports.projectsByFunder = async (req, res, next) => {
  const id = req.params.id;
  const { limit = 9, page = 1 } = req.query;
  console.log(id);
  const project_by_funder = await project
    .find({
      funder: id,
    })
    .sort({ approval_date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "status", model: "Status" })
    .populate({ path: "thematique", model: "Thematiques" });
  res.status(200).json({ data: project_by_funder, page: page });
};

exports.globalProjectsByKeyWord = async (req, res, next) => {
  const { limit = 9, page = 1, searchText } = req.query;

  try {
    const projects = await project
      .find({
        name: { $nin: [null, ""] },
        name: { $regex: new RegExp(searchText, "i") },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ approval_date: 1 })
      .populate({ path: "country", model: "Country" })
      .populate({ path: "status", model: "Status" })
      .populate({ path: "thematique", model: "Thematiques" });

    res.status(200).json({
      data: projects,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.projectsByStatus = async (req, res, next) => {
  const { limit = 9, page = 1, searchText, status_project } = req.query;

  try {
    const findedStatus = await status.findOne({
      name: { $regex: new RegExp(status_project, "i") },
    });

    const projects = await project
      .find({
        name: { $nin: [null, ""] },
        name: { $regex: new RegExp(searchText, "i") },
        status: findedStatus._id,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ approval_date: 1 })
      .populate({ path: "country", model: "Country" })
      .populate({ path: "status", model: "Status" })
      .populate({ path: "thematique", model: "Thematiques" });

    res.status(200).json({
      data: projects,
      page: page,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getNumberProjectsByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });
    let numberProjects = await project.countDocuments({
      country: findCountry._id,
    });
    res.status(200).json(numberProjects);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getNumberProjectsByCountryNULL = async (req, res, next) => {
  try {
    let numberProjects = await project.countDocuments({
      country: null,
    });
    res.status(200).json(numberProjects);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getNumberAllProjects = async (req, res, next) => {
  try {
    let numberallProjects = await project.countDocuments({
    
    });
    res.status(200).json(numberallProjects);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.addProject = async (req, res, next) => {
  const proj = new project(req.body);
  if (req.file) proj.image_url = req.file.path;

  try {
    await proj.save();
    res.status(201).json(proj);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.deleteProject = async (req, res, next) => {
  const id = req.params.id;
  try {
    await project.deleteOne({ _id: id });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getAllProjectsByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByCountry = await project
      .find(
        {
          country: findCountry._id,
        },
        { _id: 1, name: 1, total_cost: 1, project_of_month: 1, image_url: 1 }
      )
      .sort([["_id", -1]])
      .limit(200)
      .populate("thematique");

    res.status(200).json(ProjectsByCountry.reverse());
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllProjectsByPaginationAndCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  const { limit = 9, page = 1 } = req.query;

  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByCountry = await project
      .find(
        {
          country: findCountry._id,
          name: { $regex: new RegExp(req.body.searchText, "i") },
          validation: 0,
        },

        { _id: 1, name: 1, total_cost: 1, project_of_month: 1, image_url: 1 }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate("thematique");

    let count = await project.countDocuments({
      country: findCountry._id,
      name: { $regex: new RegExp(req.body.searchText, "i") },
      validation: 0,
    });

    res
      .status(200)
      .json({ data: ProjectsByCountry, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllProjectsOfMonthByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByCountry = await project.find(
      {
        country: findCountry._id,
        project_of_month: true,
      },
      { _id: 1, name: 1 }
    );

    res.status(200).json(ProjectsByCountry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getOneProjectsOfMonthByCountry = async (req, res, next) => {
  const { codeCountry } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectOfMonthByCountry = await project.findOne({
      country: findCountry._id,
      project_of_month: true,
      validation: true,
    });

    res.status(200).json(ProjectOfMonthByCountry);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.enablePojectOfMonth = async (req, res, next) => {
  const { codeCountry, projectId } = req.params;
  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    const projectOfMonth = await project.findOne({
      project_of_month: true,
      country: findCountry._id,
    });

    if (projectOfMonth._id !== null) {
      mongoose.set("useFindAndModify", false);
      project.findByIdAndUpdate(
        projectOfMonth._id,
        { project_of_month: false },
        function (err) {
          if (err) {
            //res.status(500).json({ error: err });
          }
        }
      );
    }
  } catch (error) {
    //res.status(500).json({ error: error });
  }
  mongoose.set("useFindAndModify", false);
  project.findByIdAndUpdate(
    projectId,
    { project_of_month: true },
    function (err) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({
          message: "project updated successfully",
        });
      }
    }
  );
};

exports.disabledPojectOfMonth = async (req, res, next) => {
  const id = req.params.projectId;

  mongoose.set("useFindAndModify", false);
  project.findByIdAndUpdate(id, { project_of_month: false }, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "project updated successfully",
      });
    }
  });
};

exports.updateProject = async (req, res, next) => {
  const { projectId } = req.params;
  if (req.file) req.body.image_url = req.file.path;
  if (!req.body.sub_implementer) req.body.sub_implementer = [];
  if (!req.body.sub_funder) req.body.sub_funder = [];
  if (req.body.description == "") req.body.description = null;
  if (req.body.objectives == "") req.body.objectives = null;
  mongoose.set("useFindAndModify", false);
  project.findByIdAndUpdate(projectId, req.body, function (err) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({
        message: "project updated successfully",
      });
    }
  });
};

exports.getAllProjectsByCountryNull = async (req, res, next) => {
  const { codeCountry } = req.params;
  const { limit, page } = req.query;
  try {
    let ProjectsByCountry = await project
      .find(
        {
          country: null,
        },
        {
          _id: 1,
          name: 1,
          total_cost: 1,
          project_of_month: 1,
          image_url: 1,
          country: 1,
        }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .limit(200)
      .populate("thematique");
    let count = await project.countDocuments({
      country: null,
    });
    console.log("ok");
    res
      .status(200)
      .json({ data: ProjectsByCountry, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.acceptProject = async (req, res, next) => {
  const { projectId } = req.params;
  const filter = { _id: projectId };
  const update = { validation: 1 };

  try {
    let projectAccepted = await project.findOneAndUpdate(filter, update, {
      new: true,
    });

    res.status(200).json(projectAccepted);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.refuseProject = async (req, res, next) => {
  const { projectId } = req.params;
  const filter = { _id: projectId };
  const update = { validation: 2 };

  try {
    let projectRefused = await project.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(projectRefused);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.getAllProjectsAccepted = async (req, res, next) => {
  const { codeCountry } = req.params;
  const { limit = 9, page = 1 } = req.query;

  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByCountryAccepted = await project
      .find(
        {
          country: findCountry._id,
          name: { $regex: new RegExp(req.body.searchText, "i") },
          validation: 1,
        },
        { _id: 1, name: 1, total_cost: 1, project_of_month: 1, image_url: 1 }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate("thematique");

    let count = await project.countDocuments({
      country: findCountry._id,
      name: { $regex: new RegExp(req.body.searchText, "i") },
      validation: 1,
    });

    res
      .status(200)
      .json({ data: ProjectsByCountryAccepted, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getAllProjectsOfMonthByThematic = async (req, res, next) => {
  const { id, codeCountry } = req.params;

  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByThematic = await project.find({
      country: findCountry._id,
      thematique: id,

      validation: 1,
    });
    res.status(200).json(ProjectsByThematic);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.projectsByThematicc = async (req, res, next) => {
  const id = req.params.id;
  const { limit = 9, page = 1 } = req.query;
  console.log(id);
  const projects_by_thematiques = await project
    .find({
      thematique: id,
    })
    .sort({ approval_date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate({ path: "country", model: "Country" })
    .populate({ path: "thematique", model: "Thematiques" });
  res.status(200).json({ data: projects_by_thematiques, page: page });
};
exports.getAllProjectsOfMonthByDonors = async (req, res, next) => {
  const { idOrg, codeCountry } = req.params;

  try {
    // let findThematique = await thematique.findOne({

    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByDonors = await project.find({
      country: findCountry._id,
      funder: idOrg,
      validation: 1,
    });
    res.status(200).json(ProjectsByDonors);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getAllProjectsOfMonthByImplementers = async (req, res, next) => {
  const { idOrg, codeCountry } = req.params;

  try {
    let findCountry = await country.findOne({
      code: codeCountry.toUpperCase(),
    });

    let ProjectsByImplementers = await project.find({
      country: findCountry._id,
      implementer: idOrg,
      validation: 1,
    });
    res.status(200).json(ProjectsByImplementers);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getAllProjectsAddedByExpertByPagination = async (req, res, next) => {
  const { limit = 9, page = 1 } = req.query;

  try {
    let ProjectsAddedByExpert = await project
      .find(
        {
          name: { $regex: new RegExp(req.body.searchText, "i") },
          added_by_Expert: 1,
        },

        { _id: 1, name: 1, total_cost: 1, project_of_month: 1, image_url: 1 }
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort([["_id", -1]])
      .populate("thematique");

    let count = await project.countDocuments({
      name: { $regex: new RegExp(req.body.searchText, "i") },
      added_by_Expert: 1,
    });

    res
      .status(200)
      .json({ data: ProjectsAddedByExpert, page: page, totalCount: count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.addProjectByExpert = async (req, res, next) => {
  req.body.added_by_Expert = 1;
  const proj = new project(req.body);
  if (req.file) proj.image_url = req.file.path;

  try {
    await proj.save();
    res.status(201).json(proj);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
