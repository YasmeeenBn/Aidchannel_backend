const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
var cron = require("node-cron");
const cookieParser = require("cookie-parser");
const app = express();

// the routes
const initRoutes = require("./routes/InitDBRoute");
const scrappingAFDBRoutes = require("./routes/ScrappingAFDBRoute");
const scrappingAIRoutes = require("./routes/ScrappingAIRoute");
const scrappingGIZRoutes = require("./routes/scrappingGIZRoute");
const scrappingUNDPRoutes = require("./routes/ScrappingUNDPRoute");
// const scrappingAFDRoutes = require("./routes/ScrappingAFDRoute");
const scrappingADBRoutes = require("./routes/ScrappingADBRoute");
const scrappingWBRoutes = require("./routes/ScrappingWBRoute");

const KpiRoutes = require("./routes/kpiRoute");
const KeyExpertsRoutes = require("./routes/keyExpertRoute");
// const scrappingIATIRoutes = require("./routes/ScrappingIATIRoute");
const expectedResultRoutes = require("./routes/expectedResultRoute");
const localizationRoute = require("./routes/localizationRoute");
const userRoutes = require("./routes/userRoute");
const commonUserRoute = require("./routes/commonUserRoute");
const authRoute = require("./routes/authRoutes");
const organizationtypesRoutes = require("./routes/organizationtypesRoute");
const thematiqueRoutes = require("./routes/thematiqueRoute");
const organizationRoutes = require("./routes/organizationRoute");
const countryRoutes = require("./routes/countryRoute");
const impactRoutes = require("./routes/impactRoute");
const outComeRoutes = require("./routes/outComeRoute");
const outPutRoutes = require("./routes/outPutRoute");
const activityRoutes = require("./routes/activityRoute");
const viewRoutes = require("./routes/linkedin/viewRoutes");
const wbroutes = require("./routes/ScrappingWBRoute");

const MainBeneficiaryRoutes = require("./routes/mainBenificiaryyRoute");
const statusRoutes = require("./routes/statusRoute");
const projectRoutes = require("./routes/projectRoute");
const interviewRoutes = require("./routes/interview");
const interviewtypesRoutes = require("./routes/interviewTypesRoute");

const ExpertArticleRoutes = require("./routes/ExpertArticleRoute");

const newsRoute = require("./routes/newsRoute");
const articleRoutes = require("./routes/articleRoute");
const multimediaAPIRoutes = require("./routes/multimediaAPIRoute");
const tweetRoute = require("./routes/tweetsRoute");
const youtubeRoute = require("./routes/youtubeRoute");

/////////////// LINKEDIN ROUTES /////////////
const postRoute = require("./routes/linkedin/postRoute");
const invitationRoute = require("./routes/linkedin/invitationRoute");
const commentRoute = require("./routes/linkedin/commentRoute");
// add Access-Control-Allow-Origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//parse json
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(expressValidator());
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("WELCOME AIDCHANNEL Node 14");
});
app.use("/article", articleRoutes);
app.use("/init", initRoutes);
app.use("/organizationtypes", organizationtypesRoutes);
app.use("/thematiques", thematiqueRoutes);
app.use("/organization", organizationRoutes);
app.use("/country", countryRoutes);
app.use("/status", statusRoutes);
app.use("/project", projectRoutes);

//  scrapping
app.use("/scrappingAFDB", scrappingAFDBRoutes);
app.use("/scrappingAI", scrappingAIRoutes);
app.use("/scrappingGIZ", scrappingGIZRoutes);
app.use("/scrappingUNDP", scrappingUNDPRoutes);
// app.use("/scrappingAFD", scrappingAFDRoutes);
app.use("/scrappingADB", scrappingADBRoutes);

app.use("/scrappingWB", scrappingWBRoutes);
app.use("/user", userRoutes);

app.use("/user", userRoutes);
app.use("/projects", wbroutes);
app.use("/impact", impactRoutes);
app.use("/outcome", outComeRoutes);
app.use("/output", outPutRoutes);
app.use("/activity", activityRoutes);
app.use("/expectedResult", expectedResultRoutes);
app.use("/interview", interviewRoutes);
app.use("/interviewtypes", interviewtypesRoutes);

app.use("/ExpertArticle", ExpertArticleRoutes);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/keyExpert", KeyExpertsRoutes);
app.use("/multimedia", multimediaAPIRoutes);
app.use("/kpi", KpiRoutes);
app.use("/mainBeneficiary", MainBeneficiaryRoutes);
app.use("/localization", localizationRoute);
app.use("/commonUser", commonUserRoute);
app.use("/view", viewRoutes);
// app.use("/IATI", scrappingIATIRoutes);

app.use("/twitter", tweetRoute);
app.use("/youtube", youtubeRoute);

app.use("/post", postRoute);
app.use("/invitation", invitationRoute);
app.use("/comment", commentRoute);
const Ctrl = require("./controllers/scrappingAFDBController");
const CtrlMulti = require("./controllers/multimediaAPIController");
const CtrlIATI = require("./controllers/scrappingIATIController");
const CtrlNews = require("./controllers/scrappingNewsController");
const CtrlGIZ = require("./controllers/scrappingGIZController");
const CtrlAFDB = require("./controllers/scrappingAFDBController");
const CtrlWB = require("./controllers/scrappingWBController");
const CtrlUNDP = require("./controllers/scrappingUNDPController");
app.use("/uploads", express.static("uploads"));

//Scrapping Interruptions

// cron.schedule("* * */14 * *", function () {
//   console.log("update")
//   CtrlIATI.scrapping();
// });

// if (CtrlIATI.interrupted) {
//   CtrlIATI.scrapping();
// }

// if (await CtrlIATI.interrupted()) {
// CtrlIATI.scrappingIATI();}

// CtrlAFDB.putAFDBProjects();

// CtrlUNDP.getUNDPProjects();
// CtrlWB.getWBProjects();
// CtrlGIZ.getProjects();

// cron.schedule("00 00 * * *", function () {
//   console.log("update");
//   CtrlMulti.putTweets();
// });

// cron.schedule("00 00 * * *", function () {
//   console.log("update");
//   CtrlMulti.putYTVideos();
// });


// CtrlNews.addOrgArticles()


module.exports = app;
