const router = require("express").Router();
const mongoose = require("mongoose");

const log = require("../helper/logger");
var fbadmin = require("firebase-admin");
const User = mongoose.model("User");
const Group = mongoose.model("Group");

const chatController = require("../controllers/chat");
const chatsocket = require("../controllers/socketChat");
const response = require("../helper/response");
const user = require("../controllers/userControl");

router.post("/addChat", (req, res) => {
  log.debug("api/chat/addChat");
  if (req.body.isGroup == true) {
    const message = {
      notification: {
        title: req.body.title,
        body: req.body.message,
      },
    };
    const options = { priority: "high" };
    const registrationTokens = [];
    Group.findOne({ _id: mongoose.Types.ObjectId(req.body.groupId) })
      .then((resData) => {
        User.find({ _id: { $in: resData.participants } }, { deviceToken: 1 })
          .then((data) => {
            console.log(data);
            data.forEach((ele) => {
              registrationTokens.push(ele.deviceToken);
            });
            chatController
              .putChat(req.body)
              .then((chatData) => {
                fbadmin
                  .messaging()
                  .sendToDevice(registrationTokens, message, options)
                  .then((response) => {
                    console.log("response", response);
                  });
                response.successResponse(res, 200, chatData);
              })
              .catch((error) => {
                log.error(error.code);
                response.errorResponse(res, parseInt(error.code));
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    let token = String;
    User.findOne({ _id: req.body.receivedBy }).then((data) => {
      token = data.deviceToken;
      log.debug("token -->", token);
      const deviceToken = token;
      const message = {
        notification: {
          title: req.body.title,
          body: req.body.message,
        },
      };
      const options = { priority: "high" };

      log.debug("/api/chat/addchatDetails");
      chatController
        .putChat(req.body)
        .then((chatData) => {
          fbadmin
            .messaging()
            .sendToDevice(deviceToken, message, options)
            .then((response) => {
              console.log("response", response);
            });
          response.successResponse(res, 200, chatData);
        })
        .catch((error) => {
          log.error(error.code);
          response.errorResponse(res, parseInt(error.code));
        });
    });
  }
});

router.get("/fetchChat/:id", (req, res) => {
  log.debug("api/chat/getChat");
  chatController
    .getChat(req.params.id)
    .then((chatData) => {
      response.successResponse(res, 200, chatData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

router.get("/fetchPreviousChat/:chatheadid/:messageid", (req, res) => {
  log.debug("api/chat/getPreviousChat");
  chatController
    .getPreviousChat(req.params.chatheadid, req.params.messageid)
    .then((chatData) => {
      response.successResponse(res, 200, chatData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

module.exports = router;
