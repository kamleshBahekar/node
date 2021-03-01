const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Contact = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
     },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    callType: String,
    },   
    {
        timestamps: true
    });

module.exports = mongoose.model('Contact', Contact);