const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BroadcastChats = new Schema({
    sender: String,
    
    broadcastId: {
        type: mongoose.Types.ObjectId,
        ref: 'Broadcast'
    },
    message: String,
    
});

module.exports = mongoose.model('BroadcastChats', BroadcastChats);