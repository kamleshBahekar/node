const router = require("express").Router();
const statusController = require("../controllers/status");
const log = require("../helper/logger");
const response = require("../helper/response");
const config = require("./../config.json");

router.post("/", (req, res) => {
    log.debug("/api/status/addStatus");
    var obj = [];
    Array.from(req.body.fileURL).forEach(ele => {
        obj.push({
            userId: req.body.userId,
            fileURL: ele.fileURL,
        });
    })
    log.debug('obj----0 ', obj);
    statusController
        .addStatus(obj)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error.code);
            response.errorResponse(res, parseInt(error.code));
        });
});

router.get("/:id", (req, res) => {
    log.debug("api/status/getStatus");
    statusController
        .getStatus(req.params.id)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error.code);
            response.errorResponse(res, 404);
        });
});

router.put("/:id", (req, res) => {
    log.debug("api/status/updateStatus");
    let data = {
        statusText: req.body.statusText,
        fileURL: req.body.fileURL,
        bgColor: req.body.bgColor,
        textColor: req.body.textColor,
        textFont: req.body.textFont
    };
    console.log(req.params.id, data);
    statusController
        .updateStatus(req.params.id, data)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            response.errorResponse(res, parseInt(error.code));
        });
});

router.delete("/:id", (req, res) => {
    log.debug("api/status/deleteStatus");
    statusController
        .deleteStatus(req.params.id)
        .then((resData) => {
            console.log(resData);
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error.code);
            response.errorResponse(res, parseInt(error.code));
        });
});

router.get("/friendsStatus/:id", (req, res) => {
    log.debug("api/status/getAllofUserStatus");
    statusController
        .friendStatus(req.params.id)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error.code);
            response.errorResponse(res, 404);
        });
});

// router.post("/time", (req, res) => {
//   log.debug("api/status/getAllofUserStatus");
//   statusController
//     .autoDelete()
//     .then((resData) => {
//       response.successResponse(res, 200, resData);
//     })
//     .catch((error) => {
//       log.error(error.code);
//       response.errorResponse(res, 404);
//     });
// });

module.exports = router;