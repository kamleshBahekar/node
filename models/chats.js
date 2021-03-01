const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Chat = new Schema({
    chatHead: {
        type: mongoose.Types.ObjectId,
    },
    
    sentBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receivedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    ifFile: Boolean,
    sent:{
        type: Boolean,
        default: true
    },
    attachmentType: String,
    fileURL: {
        type: String,
        default: null
    },
    isGroup:{
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Group'
    }
    
}, {
    timestamps: true
});
module.exports = mongoose.model('Chat', Chat);