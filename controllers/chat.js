const mongoose = require("mongoose");

const User = mongoose.model("User");
const ChatHead = mongoose.model("ChatHead");
const Chat = mongoose.model("Chat");
const log = require("../helper/logger");
const response = require("../helper/response");
const { lodash } = require("consolidate");

module.exports = {
    putChat: (chatData) => {
        log.debug("putChat", chatData);
        return new Promise(function(resolve, reject) {
            var chat = new Chat(chatData);
            chat
                .save()
                .then((data) => {
                console.log("data", data)
                    resolve(data);
                })
                .catch((error) => {
                    log.debug("Add chat error", error);
                    reject(error);
                });
        });
    },

    getChat: (id) => {
        log.debug("getChat", id);
        return new Promise(function(resolve, reject) {
            Chat.find({
                    chatHead: id,
                })
                .sort({ _id: -1 })
                .limit(20)
                .then((data) => {
                    if (data) {
                        resolve(data.reverse());
                    }
                })
                .catch((error) => {
                    log.debug("get chat error : ", error);
                    reject({ code: 500 });
                });
        });
    },

    getPreviousChat: (chatHeadId, messageId) => {
        log.debug("getPreviousChat", chatHeadId, messageId);
        return new Promise(function(resolve, reject) {
            Chat.find({
                    $and: [
                        { chatHead: chatHeadId },
                        { _id: { $lt: mongoose.Types.ObjectId(messageId) } }
                    ]
                })
                .sort({ _id: -1 })
                .limit(20)
                .then((data) => {
                    if (data) {
                        resolve(data.reverse());
                    }
                })
                .catch((error) => {
                    log.debug("get chat error : ", error);
                    reject({ "code": 500 });
                });
        });
    },
};