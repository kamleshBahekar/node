const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Contact = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
     },
    payment:{}
    },   
    {
        timestamps: true
    });

module.exports = mongoose.model('Payment', Payment);