const router = require('express').Router();
const log = require('../../helper/logger');
const response = require('../../helper/response');
var nodemailer = require('nodemailer');
let config = require('../../config.json');
var fs = require('fs');

// router.post('/', (req, res) => {
module.exports = {
    sendMail: (data) => {
        return new Promise((resolve, reject) => {
            log.debug('/api/sendnotification/');
            console.log(config.auth.user, config.auth.pass);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.auth.user,
                    pass: config.auth.pass
                }
            });
            var mailOptions = {
                from: "" + data.from + " <" + config.auth.user + ">",
                to: data.email,
                subject: data.subject,
                html: data.out,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    // response.errorResponse(500, error);
                    reject(error);
                } else {
                    // response.successResponse(res, 200, info.response);
                    resolve(info.response)
                }
            });
        })
    }
}
