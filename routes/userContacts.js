const router = require("express").Router();
const log = require("../helper/logger");

const contactController = require("../controllers/userContacts");
const response = require("../helper/response");


router.post("/register/contacts", (req, res) => {
    contactController
        .registeredContacts(req.body.mobileNumbers, req.body.userId)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error);
            response.errorResponse(res, 500);
        });
});

router.get("/myRegistered/contacts/:userId", (req, res) => {
    contactController
        .getContacts(req.params.userId)
        .then((resData) => {
            response.successResponse(res, 200, resData);
        })
        .catch((error) => {
            log.error(error);
            response.errorResponse(res, 500);
        });
});

module.exports = router;