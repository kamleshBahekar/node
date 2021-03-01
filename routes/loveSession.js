const router = require("express").Router();
const log = require("../helper/logger");
const response = require("../helper/response");
const LiveSession = require("../models/liveSessions");

router.get("/session/status", (req, res) => {
  log.debug("/api/contact/getAll");
  LiveSession.findById({ _id: "5f3f8528d2349e3aa53e0669" })
    .then((resdata) => {
      response.successResponse(res, 200, resdata);
    })
    .catch((err) => {
      response.errorResponse(res, 500);
    });
});

router.put("/session/status/off", (req, res) => {
  log.debug("/api/contact/getAll");
  LiveSession.findByIdAndUpdate(
    { _id: "5f3f8528d2349e3aa53e0669" },
    { isLive: false },
    { $new: true }
  )
    .then((resdata) => {
      response.successResponse(res, 200, resdata);
    })
    .catch((err) => {
      response.errorResponse(res, 500);
    });
});

router.post("/session/add", (req, res) => {
  log.debug("/api/contact/getAll");
  var obj = new LiveSession();
  obj
    .save()
    .then((resdata) => {
      response.successResponse(res, 200, resdata);
    })
    .catch((err) => {
      response.errorResponse(res, 500);
    });
});

module.exports = router;
