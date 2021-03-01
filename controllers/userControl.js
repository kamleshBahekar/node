const mongoose = require("mongoose");
const User = mongoose.model("User");
const log = require("../helper/logger");
const { use } = require("../routes/userlohg");
const otp = require("../helper/otp");
var moment = require("moment");
var fbadmin = require("firebase-admin");
const LiveSession = require("../models/liveSessions");

module.exports = {
  getLogin: (userDetails) => {
    log.debug("getLogin", userDetails);
    return new Promise(function (resolve, reject) {
      User.findOne(
        {
          mobileNumber: userDetails.mobileNumber,
        },
        {
          status: 0,
          verify: 0,
        }
      )
        .then((data) => {
          if (data) {
            resolve(data);
          } else {
            console.log("Adding new user....!");
            log.debug("addUser", userDetails);
            var user = new User(userDetails);
            user
              .save()
              .then((data) => {
                resolve(data);
              })
              .catch((error) => {
                log.error("Add User Error :", error);
                reject(error);
              });
          }
        })
        .catch((error) => {
          log.error("Get All User Error :", error);
          reject(error);
        });
    });
  },

  addUser: (data) => {
    return new Promise(function (resolve, reject) {
      var video = new User(data);
      video
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          log.debug("Add Video error", error);
          reject(error);
        });
    });
  },
  getProfile: (id) => {
    log.debug("getProfile", id);
    return new Promise((resolve, reject) => {
      User.findOne({ _id: id })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          log.error("error", error);
          reject(error);
        });
    });
  },
  getAllUsers: () => {
    log.debug("get all users");
    return new Promise((resolve, reject) => {
      User.find({ status: { $ne: "deleted" } })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          log.error("error", error);
          reject(error);
        });
    });
  },
  update: (id, user) => {
    log.debug("update Id", id);
    log.debug("updateUser", user);
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdate(id, { $set: user }, { new: true })
        .then((data) => {
          if (data) {
            resolve(data);
          }
        })
        .catch((error) => {
          log.debug("get chat error : ", error);
          reject(error);
        });
    });
  },

  verifyOtp: (userData) => {
    return new Promise(function (resolve, reject) {
      User.findOne({ mobileNumber: userData.mobileNumber, otp: userData.otp })
        .then((resData) => {
          if (resData) {
            resolve(resData);
          } else {
            reject(401);
          }
        })
        .catch((error) => {
          log.debug("no data with provided mobileNumber : ", error);
          reject(error);
        });
    });
  },

  updateToken: (id, token) => {
    log.debug("update Id", id);
    log.debug("updateUser", token);
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdate(id, { $set: token }, { new: true })
        .then((data) => {
          if (data) {
            resolve(data);
          } else {
            log.debug("user not found : ", error);
          }
        })
        .catch((error) => {
          log.debug("get chat error : ", error);
          reject({ code: 404 });
        });
    });
  },

  ckeckUser: (mobileNumber) => {
    log.debug("mobileNumber", mobileNumber);
    return new Promise(function (resolve, reject) {
      User.findOne({ mobileNumber: mobileNumber })
        .then((data) => {
          if (data) {
            resolve(data);
          } else {
            log.debug("user not found : ", error);
          }
        })
        .catch((error) => {
          log.debug("user not found : ", error);
          reject(error);
        });
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, { status: "deleted" }, { new: true })
        .then((data) => {
          if (data) {
            resolve(data);
          } else {
            log.debug("user not found : ", error);
          }
        })
        .catch((error) => {
          log.debug("get chat error : ", error);
          reject({ code: 404 });
        });
    });
  },

  updatePayment: (id, payment) => {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdate(id, { $set: payment }, { new: true })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  updateWallet: (id, amount) => {
    return new Promise(function (resolve, reject) {
      User.findByIdAndUpdate(id, { $inc: { wallet: amount } }, { new: true })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  registeredUsers: () => {
    return new Promise((resolve, reject) => {
      console.log("in controller");
      var time = moment();
      var startDate = moment().startOf("month");
      console.log("@@@@@@@", startDate);
      User.find({
        $and: [
          { createdAt: { $lte: time } },
          { createdAt: { $gte: startDate } },
          { status: { $ne: "deleted" } },
        ],
      })
        .then((resData) => {
          resolve(resData);
        })
        .catch((err) => {
          console.log("err", err);

          reject(err);
        });
    });
  },

  lastUsers: (data) => {
    return new Promise((resolve, reject) => {
      if (data.id) {
        User.find({ _id: { $lt: mongoose.Types.ObjectId(data.id) } })
          .sort({ _id: -1 })
          .limit(data.limit)
          .then((resData) => {
            if (resData) {
              resolve(resData);
            }
          })
          .catch((error) => {
            log.debug("get chat error : ", error);
            reject({ code: 500 });
          });
      } else {
        User.find()
          .sort({ _id: -1 })
          .limit(data.limit)
          .then((data) => {
            if (data) {
              User.count()
                .then((payload) => {
                  var obj = {
                    totalCount: payload,
                    userList: data,
                  };
                  resolve(obj);
                })
                .catch((err) => {
                  console.log("****************err", err);
                });
            }
          })
          .catch((error) => {
            log.debug("get chat error : ", error);
            reject({ code: 500 });
          });
      }
    });
  },

  notifyAll: (messageBody) => {
    return new Promise(function (resolve, reject) {
      User.find({ subscription: { $ne: false } })
        .then((data) => {
          LiveSession.findByIdAndUpdate(
            { _id: "5f3f8528d2349e3aa53e0669" },
            { isLive: true },
            { $new: true }
          )
            .then((live) => {
              console.log("live true");
            })
            .catch((err) => console.log("err live"));
          var deviceTokens = [];
          data.forEach((ele) => {
            deviceTokens.push(ele.deviceToken);
          });
          const message = {
            notification: {
              title: "Go Live now..!",
              body: messageBody,
            },
          };
          const options = { priority: "high" };
          fbadmin
            .messaging()
            .sendToDevice(deviceTokens, message, options)
            .then((response) => {
              console.log("response", response);
              resolve(response);
            });
        })
        .catch((error) => {
          log.debug("user not found : ", error);
          reject(error);
        });
    });
  },
};
