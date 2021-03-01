let mongoose = require("mongoose");
let config = require("../config");

module.exports = {
  connect: function () {
    let db = mongoose
      .connect(config.dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("connected");
      })
      .catch((err) => {
        console.log("err while db connect", err);
      });

    mongoose.Promise = global.Promise;
  },
  initModels: function () {
    require("../models/index");
  },
};
