const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const UserContacts = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    regestered: Array,
    notRegestered: Array,
}, {
    timestamps: true,
});
module.exports = mongoose.model("UserContacts", UserContacts);