const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ChatHead = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    chatHead: String,
    isGroup: {
        type: Boolean,
        default: false
    },
    isBroadcast: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Group'
    },
    messageBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    isBroadcast: {
        type: Boolean,
        default: false
    },
    lastMsg: String,
    broadcastId: {
        type: mongoose.Types.ObjectId,
        ref: 'Broadcast'
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('ChatHead', ChatHead);