const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const LiveSession = new Schema({
  isLive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("LiveSession", LiveSession);
