const mongoose = require("mongoose");
const log = require("../helper/logger");
const { debug } = require("../helper/logger");
const cons = require("consolidate");
const Video = mongoose.model("Video");

module.exports = {
  addVideo: (vidData) => {
    log.debug("addVideo", vidData);
    return new Promise(function (resolve, reject) {
      var video = new Video(vidData);
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

  getVideo: (id) => {
    log.debug("getVideo", id);
    return new Promise(function (resolve, reject) {
      Video.findById({
        _id: id,
      })
        .then((data) => {
          if (data) {
            resolve(data);
          }
        })
        .catch((error) => {
          log.debug("get Video error : ", error);
          reject(error);
        });
    });
  },

  getAllVideos: () => {
    log.debug("getAllVideos");
    return new Promise(function (resolve, reject) {
        Video.find({}, (err, videos) => {
        
        if (err) {
          reject({ code: "103" });
        }else{
            resolve(videos);
        }
      });
    });
  },

  updateVideo: (id, vidData) => {
    return new Promise(function (resolve, reject) {
      Video.findByIdAndUpdate(id, { $set: vidData }, { new: true })
        .then((data) => {
          if (data) {
            resolve(data);
          }
        })
        .catch((error) => {
          log.debug("get vid error : ", error);
          reject(error);
        });
    });
  },

  deleteVideo: (id) => {
    log.debug("id", id);
    return new Promise(function (resolve, reject) {
      Video.findByIdAndDelete(id)
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
};
