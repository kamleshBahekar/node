const router = require("express").Router();
const contactController = require("../controllers/contact");
const log = require("../helper/logger");
const response = require("../helper/response");
const users = require("../models/users");

router.post("/", (req, res) => {
    log.debug("/api/contact/add");
    let token;
    log.debug('token -->', token);
    users.findById({ _id: req.body.receiver }, { deviceToken: 1 }).then((tokenData) => {
        token = tokenData.deviceToken
    }).catch(err => console.log(err));
    const deviceToken = token;
    const message = {
        notification: {
            title: req.body.title,
            body: req.body.message,
        },
    };
    console.log("message", message)
    const options = { priority: "high" };
    contactController
        .addContact(req.body)
        .then((contactData) => {
            fbadmin
                .messaging()
                .sendToDevice(deviceToken, message, options)
                .then((response) => {
                    console.log("response", response);
                }).catch(err => {
                    console.log("+++++++++++++++++++++++", err)
                })
            response.successResponse(res, 200, contactData);
        })
        .catch((error) => {
            log.error("=====================", error.code);
            response.errorResponse(res, parseInt(error.code));
        });
});


router.get("/getAll/:id", (req, res) => {
    log.debug("/api/contact/getAll");
    contactController
        .getAllContact(req.params.id)
        .then((contactData) => {
            response.successResponse(res, 200, contactData);
        })
        .catch((error) => {
            log.error(error.code);
            response.errorResponse(res, 500);
        });
});

// router.post("/addChat", (req, res) => {
//   log.debug("api/chat/addChat");

//   let token = String;
//   User.findOne({ _id: req.body.receivedBy }).then((data) => {
//     token = data.deviceToken;
//     log.debug('token -->', token);
//     const deviceToken = token;
//     const message = {
//     notification: {
//       title: req.body.title,
//       body: req.body.message,
//     },
//   };
//   const options = { priority: "high" };

//   log.debug("/api/chat/addchatDetails");
//   chatController
//     .putChat(req.body)
//     .then((chatData) => {
//       fbadmin
//         .messaging()
//         .sendToDevice(deviceToken, message, options)
//         .then((response) => {
//           console.log("response", response);
//         })
//       response.successResponse(res, 200, chatData);
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, parseInt(error.code));
//     });
//   });

// });

module.exports = router;