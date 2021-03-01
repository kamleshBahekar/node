const mongoose = require("mongoose");
var md5 = require("md5");

const User = mongoose.model("User");
const ChatHead = mongoose.model("ChatHead");
const BroadcastChats = mongoose.model("BroadcastChats");
const Group = mongoose.model("Group");
const log = require("../helper/logger");
const user = require("./userControl");
const cons = require("consolidate");
const response = require("../helper/response");
const chatHeads = require("../models/chatHeads");
const Chat = mongoose.model("Chat");
const Broadcast = mongoose.model("Broadcast");

module.exports = {
  addHead: (headData) => {
    return new Promise(function (resolve, reject) {
      log.debug("addHead", headData);
      User.find({ mobileNumber: { $in: headData.participents } }, { _id: 1 })
        .then((resIds) => {
          var payload = [];
          resIds.forEach((ele) => {
            payload.push(ele._id);
          });
          var pld = payload;
          console.log("$$$$$$$$$$$$$$", pld);
          ChatHead.find({
            $or: [
              {
                $and: [
                  { sender: headData.sender },
                  { receiver: { $in: payload } },
                ],
              },
              {
                $and: [
                  { sender: { $in: payload } },
                  { receiver: headData.sender },
                ],
              },
            ],
          })
            .then((resData) => {
            console.log("resData", resData)
              
              var tempArry = payload;
              resData.forEach((ele) => {
                payload.forEach((element, index) => {
                  ele.isBroadcast = true;
                  if (
                    element.toString() == ele.sender.toString() ||
                    element.toString() == ele.receiver.toString()
                  ) {
                    tempArry.splice(index, 1);
                  }
                });
              });
              console.log("**************",tempArry)

              var uploadArray = [];
              tempArry.forEach((ele) => {
                uploadArray.push({
                  sender: headData.sender,
                  receiver: ele,
                  isBroadcast: true,
                });
              });
              ChatHead.insertMany(uploadArray).then((rData) => {
                // console.log("***********************",resData);
                let parties=[];
                resData.forEach(ele=>{
                  parties.push(ele._id)
                });
                rData.forEach(ele=>{
                  parties.push(ele._id)
                });
                console.log("parties", parties)

                let obj = {
                  sender: headData.sender,
                  chatHeads: parties,
                  participents: pld,
                  name: headData.name,
                }

                var head = new Broadcast(obj);
                head
                  .save()
                  .then((data) => {
                    console.log("broadcast saved");
                    resolve(data);
                  })
                  .catch((error) => {
                    log.error("Add head Error :", error);
                    reject(error);
                  });
            })
            .catch((err) => {
              console.log(err);
              reject({ code: 500 });
            });
        })
        .catch((error) => {
          log.error("Add head Error :", error);
        });
    });
    });
  },

  addBroadcastChat: (chatData) => {
    log.debug("addCatagory", chatData);
    return new Promise(function (resolve, reject) {
      Chat.insertMany(chatData)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          log.debug("Add status error", error);
          reject(error);
        });
    });
  },

  putChat: (message, broadcastId) => {
       
        return new Promise(function(resolve, reject) {
            var chatData ={
              broadcastId: broadcastId,
              message: message
            }
            var chat = new BroadcastChats(chatData);
            chat
                .save()
                .then((data) => {
                console.log("data", data)
                    resolve(data);
                })
                .catch((error) => {
                    log.debug("Add chat error", error);
                    reject(error);
                });
        });
    },

    getChat: (id) => {
        log.debug("getChat", id);
        return new Promise(function(resolve, reject) {
          BroadcastChats.find({
                    broadcastId: id,
                })
                .sort({ _id: -1 })
                .limit(20)
                .then((data) => {
                    if (data) {
                        resolve(data.reverse());
                    }
                })
                .catch((error) => {
                    log.debug("get chat error : ", error);
                    reject({ code: 500 });
                });
        });
    },

    getPreviousChat: (chatHeadId, messageId) => {
        log.debug("getPreviousChat", chatHeadId, messageId);
        return new Promise(function(resolve, reject) {
            BroadcastChats.find({
                    $and: [
                        { broadcastId: chatHeadId },
                        { _id: { $lt: mongoose.Types.ObjectId(messageId) } }
                    ]
                })
                .sort({ _id: -1 })
                .limit(20)
                .then((data) => {
                    if (data) {
                        resolve(data.reverse());
                    }
                })
                .catch((error) => {
                    log.debug("get chat error : ", error);
                    reject({ "code": 500 });
                });
        });
    },

};
