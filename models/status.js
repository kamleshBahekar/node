const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Status = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    statusType: {
        type: String,
        enum: ['Text', 'Image', 'Video'],
    },
    statusText: String,
    fileURL: String,
    bgColor: String,
    textColor: String,
    textFont: String
}, {
    timestamps: true
});
module.exports = mongoose.model('Status', Status);