const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Broadcast = new Schema({
    name: String,
    sender: String,
    isGroup: {
        type: Boolean,
        default: false,
    },
    chatHeads: {
        type:Array,
     },
     participents: {
         receiver: String,
         sender: String,
         chatHead: String,
         message: String
     },

     isBroadcast: {
         type: Boolean,
         default: true,
     }
    
});

module.exports = mongoose.model('Broadcast', Broadcast);