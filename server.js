// Import package dependencies
let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let database = require("./helper/database");
let fs = require("fs");
var fbadmin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const cron = require("node-cron");
const statusController = require("./controllers/status");
const response = require("./helper/response");
const log = require("./helper/logger");
const cors = require("cors");
const socket = require("./controllers/socketChat");
socket();
// Import Configurations
let config = require("./config.json");

let app = express(); // New Express Instance


let user = require("./routes/userlohg");
let upload = require("./routes/uploadRouter");
let chatHead = require("./routes/chatHead");
let chat = require("./routes/chat");
let status = require("./routes/status");
let broadcast = require("./routes/broadcast");
let contact = require("./routes/contact");
let video = require("./routes/video");
let group = require("./routes/group");
let live = require("./routes/loveSession");
let userContact = require("./routes/userContacts");

app.use("/user", user);
app.use("/uploads", upload);
app.use("/chathead", chatHead);
app.use("/chat", chat);
app.use("/status", status);
app.use("/broadcast", broadcast);
app.use("/contact", contact);
app.use("/video", video);
app.use("/group", group);
app.use("/live", live);
app.use("/contacts", userContact);




const server = require("http").Server(app);
const io = require("socket.io")(server);
app.use(cors());
enableCORS(app);
attachBodyParser(app);
enableStaticFileServer(app, config.uploadUrl, "/static");
enableStaticFileServer(app, "/public/admin/", "/");



fbadmin.initializeApp({
  credential: fbadmin.credential.cert(serviceAccount),
  databaseURL: "https://whealthylife-ae995.firebaseio.com",
});

// cron.schedule("*/5 * * * *", function() {
//     statusController.autoDelete().then((resData) => {
//         console.log(resData);
//       })
//       .catch((error) => {
//         log.error(error.code);
//       });
// });

//app.get('/firebase/notification', (req, res) => {
// const registrationToken = ""
// const message = {
//     notification: {
//         title: "enter_subject_of_notification_here",
//         body: "enter_message_here"
//     }
// }
// const options = notification_options

// fbadmin.messaging().sendToDevice(registrationToken, message, options)
//     .then(response => {
//         console.log("response", response)
//         res.status(200).send("Notification sent successfully")
//     })
//     .catch(error => {
//         console.log(error);
//     });
//})

// Connect to MongoDB Database

// Make Public And Uploads Folder If Server Have Not
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
} else {
  if (!fs.existsSync("./public/uploads")) {
    fs.mkdirSync("./public/uploads");
  }
}

// Enable CORS
function enableCORS(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}

// Attach BodyParser
function attachBodyParser(expressInstance) {
  expressInstance.use(bodyParser.json());
  expressInstance.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
}

// Enable Static File Server
function enableStaticFileServer(expressInstance, folderName, route) {
  app.use(route, express.static(path.join(__dirname, folderName)));
}

database.connect();
database.initModels();
app.listen(config.server.port, () => {
  console.log("App listening on port : ", config.server.port);
});