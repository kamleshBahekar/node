const mongoose = require("mongoose");
const log = require("../helper/logger");
const { debug } = require("../helper/logger");
const cons = require("consolidate");
const Contact = mongoose.model("Contact");

module.exports = {
    addContact: (contData) => {
        log.debug("addContact", contData);
        return new Promise(function(resolve, reject) {
            var data = {
                sender: contData.sender,
                receiver: contData.receivr,
                callType: contData.callType
            }
            var contact = new Contact(data);
            contact
                .save()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    log.debug("Add contact error", error);
                    reject(error);
                });
        });
    },

    getAllContact: (id) => {
        log.debug("getAllContacts");
        return new Promise(function(resolve, reject) {
            Contact.find({
                    $or: [
                        { sender: mongoose.Types.ObjectId(id) },
                        { receiver: mongoose.Types.ObjectId(id) },
                    ],
                })
                .populate('sender')
                .populate('receiver')
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};