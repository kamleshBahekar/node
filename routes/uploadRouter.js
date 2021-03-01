let router = require('express').Router();
let multer = require('multer');
let log = require('../helper/logger');
let config = require('../config.json');
let multerS3 = require('multer-s3');
let AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3.json');
let s3 = new AWS.S3();

// S3 Storage
// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'mooi-cabs',
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             log.debug('metadata');
//             cb(null, {
//                 fieldName: file.fieldname
//             });
//         },
//         key: function (req, file, cb) {
//             log.debug('key');
//             req.originalName = Date.now() + '-' + file.originalname;
//             log.debug('key: ', req.originalName);
//             cb(null, req.originalName);
//         }
//     })
// }).any();

// router.post('/', upload, function (req, res, next) {
//     log.debug('uploads/');
//     log.debug(req.files[0].location);
//     res.send({
//         filePath: req.files[0].location
//     });
// });



router.post('/', (req, res) => {
    log.debug('/api/uploads');

    let upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, './public/uploads');
            },
            filename: (req, file, callback) => {
                req.originalName = Date.now() + '-' + file.originalname;
                callback(null, req.originalName);
            }
        })
    }).any();// for multiple upload

    upload(req, res, (err) => {
        
        res.send({
            filePath: config.staticFilesUrl + req.originalName
        });
    });
});


router.post('/multiple', (req, res) => {
  log.debug('/api/uploads');

  let uploadMult = multer({
      storage: multer.diskStorage({
          destination: (req, file, callback) => {
              callback(null, './public/uploads');
          },
          filename: (req, file, callback) => {
              req.originalName = Date.now() + '-' + file.originalname;
              callback(null, req.originalName);
          }
      })
  }).any();// for multiple upload

  uploadMult(req, res, (err) => {
    var files = [];
    req.files.forEach(ele => {
        files.push(config.staticFilesUrl + ele.filename);
    })
    res.send({ status: 'SUCCESS', files });
  });
});

module.exports = router;