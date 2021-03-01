const router = require("express").Router();
const videoController = require("../controllers/video");
const log = require("../helper/logger");
const response = require("../helper/response");
const config = require("./../config.json");

router.post("/", (req, res) => {
  log.debug("/api/");
  videoController
    .addVideo(req.body)
    .then((vidData) => {
      response.successResponse(res, 200, vidData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

router.get("/get/:id", (req, res) => {
  log.debug("api/");
  videoController
    .getVideo(req.params.id)
    .then((vidData) => {
      response.successResponse(res, 200, vidData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, 404);
    });
});

router.get("/getAll", (req, res) => {
  log.debug("/api/catagory/getAll");
  videoController
    .getAllVideos()
    .then((vidData) => {
      response.successResponse(res, 200, vidData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, 500);
    });
});

router.put("/:id", (req, res) => {
  
  console.log(req.params.id);
  videoController
    .updateVideo(req.params.id, req.body)
    .then((vidData) => {
      response.successResponse(res, 200, vidData);
    })
    .catch((error) => {
      response.errorResponse(res, parseInt(error.code));
    });
});

router.delete("/:id", (req, res) => {
  log.debug("api/catagory/delete");
  videoController
    .deleteVideo(req.params.id)
    .then((data) => {
      console.log(data);
      response.successResponse(res, 200, data);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

module.exports = router;
