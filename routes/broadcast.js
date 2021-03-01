const router = require('express').Router();
const log = require('../helper/logger');
const mongoose = require("mongoose");

const broadCastController = require('../controllers/broadcast');
const response = require('../helper/response');
const Broadcast = mongoose.model("Broadcast");

router.post('/addHeads', (req, res) => {
    log.debug('/api/chathead/addHeads');
    broadCastController.addHead(req.body)
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

router.post("/addChat", (req, res) => {
    log.debug("/api/broadcast/addChat");

    Broadcast.findById({_id: req.body.broadcastId}).then((payload)=>{
      broadCastController.putChat(req.body.message, req.body.broadcastId).then(resData => {
        console.log('chat adde4d to broadcast', resData);
      }).catch(err => {
        console.log('error adding chat to BROADCASTCHAT', err);
      })
        var obj = [];
        Array.from(payload.chatHeads).forEach(ele => {
          obj.push({message: req.body.message, sentBy:req.body.sender,
                    chatHead:ele});
        })
        log.debug('obj----0 ', obj);
        broadCastController
        .addBroadcastChat(obj)
        .then((resData) => {
          
          response.successResponse(res, 200, resData);
          
        })
        .catch((error) => {
          log.error(error.code);
          response.errorResponse(res, parseInt(error.code));
        });
    }) .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });

     
});

router.get("/fetchChat/:broadcastId", (req, res) => {
  log.debug("api/chat/getChat");
  broadCastController
    .getChat(req.params.broadcastId)
    .then((chatData) => {
      response.successResponse(res, 200, chatData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});

router.get("/fetchPreviousChat/:broadcastId/:messageid", (req, res) => {
  log.debug("api/chat/getPreviousChat");
  broadCastController
    .getPreviousChat(req.params.broadcastId, req.params.messageid)
    .then((chatData) => {
      response.successResponse(res, 200, chatData);
    })
    .catch((error) => {
      log.error(error.code);
      response.errorResponse(res, parseInt(error.code));
    });
});
  

module.exports = router;
