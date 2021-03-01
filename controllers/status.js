const mongoose = require("mongoose");
const log = require("../helper/logger");
const { debug } = require("../helper/logger");
const cons = require("consolidate");
require('../models/index');
const ChatHead = mongoose.model("ChatHead");
const Status = mongoose.model("Status");
const User = mongoose.model("User");
var moment = require("moment");

module.exports = {
  addStatus: (statusData) => {
    log.debug("addCatagory", statusData);
    return new Promise(function (resolve, reject) {
      Status.insertMany(statusData)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          log.debug("Add status error", error);
          reject(error);
        });
    });
  },

  getStatus: (searchId) => {
    log.debug("getStatus", searchId);
    return new Promise(function (resolve, reject) {
      Status.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(searchId),
        }
      },
      {
        $group: {
          "_id": "$userId",
          fileURL: {$push: {"user_story_file":"$fileURL", "created_date":"$createdAt"} },
          usersData: {$first: "$usersData"}
      }
    }
        
      ])
        .then((data) => {
          if (data) {
            resolve(data);
          }
        })
        .catch((error) => {
          log.debug("get status error : ", error);
          reject(error);
        });
    });
  },

  updateStatus: (id, statusData) => {
    return new Promise(function (resolve, reject) {
      Status.findByIdAndUpdate(id, { $set: statusData }, { new: true })
        .then((resData) => {
          if (resData) {
            resolve(resData);
          }
        })
        .catch((error) => {
          log.debug("update status error : ", error);
          reject(error);
        });
    });
  },

  deleteStatus: (id) => {
    log.debug("id", id);
    return new Promise(function (resolve, reject) {
      Status.findByIdAndDelete(id)
        .then((data) => {
          if (data) {
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  friendStatus: (userId) => {
    log.debug("getAllfriends", userId);
    return new Promise(function (resolve, reject) {
      ChatHead.find({
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { receiver: mongoose.Types.ObjectId(userId) },
        ],
      })
        .then((resData) => {
          var myArr = [];
          resData.forEach((ele) => {
            if (ele.sender == userId) {
              myArr.push(ele.receiver);
            } else {
              myArr.push(ele.sender);
            }
          });
          Status.aggregate([
            {
              $match: {
                userId:{$in: myArr},
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "usersData",
            },
          },
          {
            $unwind: "$usersData"
          },
            {
              $group: {
                "_id": "$userId",
                fileURL: {$push: {"user_story_file":"$fileURL", "created_date":"$createdAt"} },
                usersData: {$first: "$usersData"}
            }
          }
          ])
            // .find({ userId: { $in: myArr } })
            .then((resUser) => {
              console.log(resUser);
              resolve(resUser);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  },

  autoDelete: () =>{
    return new Promise(function (resolve, reject){
      log.debug("===================")
      var time = moment().subtract(24, 'hours');
      log.debug("@@@@@@@", time)
      Status.remove({ 
        createdAt : { $lte : time }
      }).then((data)=>{
        resolve(data);
      }).catch(error =>{ reject(error) });
    })
  }

};
