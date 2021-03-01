const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Group = new Schema({
    chatHead: {
        type: mongoose.Types.ObjectId,
        ref: 'chatHead'
     },
     sender:String,
     name: String,
    participants: {type: Array} ,
    isGroup:{
        type: Boolean,
        default: true
    },
    isBroadcast:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Group', Group);