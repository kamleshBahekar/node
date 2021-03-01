const router = require('express').Router();
const log = require('../helper/logger');

const chatHeadController = require('../controllers/chatHead');
const response = require('../helper/response');


router.post('/addHeads', (req, res) => {
    log.debug('/api/chathead/addHeads');
    chatHeadController.addHead(req.body)
        .then(headData => {
            const data = {
                _id: headData._id,
                sender: headData.sender,
                receiver: headData.receiver,
                chatHead: headData.chatHead,
                status: headData.status,
                isGroup: headData.isGroup,
                groupId: headData.groupId
            }
            console.log(data);
            response.successResponse(res, 200, data);
        })
        .catch(error => {
            log.error(error.code);
            response.errorResponse(res, 500);
        });
});

router.post('/getHeads', (req, res) => {
    log.debug('/api/chathead/getHead');
    chatHeadController.addHeads(req.body)
        .then(headData => {
            const data = {
                _id: headData._id,
                sender: headData.sender,
                receiver: headData.receiver,
                chatHead: headData.chatHead,
                status: headData.status,
                isGroup: headData.isGroup,
                groupId: headData.groupId
            }
            console.log(data);
            response.successResponse(res, 200, data);
        })
        .catch(error => {
            response.successResponse(res, 201, error);
        });
});

router.post('/all', (req, res) => {
    log.debug('/api/chathead/all', req.body);
    let arr1, arr2;
    chatHeadController.getGroupHead(req.body.findId)
        .then(grpData => {
            chatHeadController.getAllOfHead(req.body.findId)
                .then(headData => {
                    arr1 = grpData.concat(headData)
                    chatHeadController.getBroadcastHead(req.body.findId)
                        .then(broadData => {
                            arr2 = arr1.concat(broadData)
                            response.successResponse(res, 200, arr2);
                        }).catch(error => {
                            log.error(error.code);
                            response.errorResponse(res, 500);
                        });
                }).catch(error => {
                    log.error(error.code);
                    response.errorResponse(res, 500);
                });
        }).catch(error => {
            log.error(error.code);
            response.errorResponse(res, 500);
        });
});

router.post('/all/broadcast', (req, res) => {
    log.debug('/api/chathead/all', req.body);

    chatHeadController.getBroadcastHead(req.body.findId)
        .then(grpData => {
                response.successResponse(res, 200, grpData);
        }).catch(error => {
            log.error(error.code);
            response.errorResponse(res, 500);
        });

});

module.exports = router;