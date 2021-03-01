const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    mobileNumber: String,
    email: String,
    name: String,
    avatar: String,
    designation: String,
    deviceToken: String,
    otp: Number,
    payment: Object,
    paymentId: String,
    subscription: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('User', User);