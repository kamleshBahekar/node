const mongoose = require("mongoose");
var md5 = require("md5");

const User = mongoose.model("User");
const ChatHead = mongoose.model("ChatHead");
const Group = mongoose.model("Group");
const log = require("../helper/logger");
const user = require("./userControl");
const Chat = mongoose.model("Chat");
const Broadcast = mongoose.model("Broadcast");

module.exports = {
  updateGroup: (headData) => {
    return new Promise(function (resolve, reject) {
      var payload;
      User.find(
        { mobileNumber: { $in: headData.participants } },
        { _id: 1 }
      ).then((resData) => {
        payload = {
          participants: resData,
        };
      });
      Group.findOne({ _id: headData.groupId })
        .then((resData) => {
          let arr;
          arr = resData.participants;

          arr.forEach((ele) => {
             payload.participants.push(ele);
          })
          console.log("+++++++++++++++++++++", payload);

          let group = { 
            participants: payload.participants,
            name: headData.name,
          };
          Group.findByIdAndUpdate(headData.groupId, { $set: group }, { new: true })
            .then((data) => {
              resolve(data);
            })  
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
