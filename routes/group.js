const router = require("express").Router();
const log = require("../helper/logger");

const groupController = require("../controllers/group");
const response = require("../helper/response");



router.put("/update", (req, res) => {
  log.debug("api/chat/getChat");
  groupController
    .updateGroup(req.body)
    .then((chatData) => {
      response.successResponse(res, 200, chatData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

module.exports = router;
