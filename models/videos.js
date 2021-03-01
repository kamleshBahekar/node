const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Video = new Schema({
    name: String,
    avatar: String,
    fileURL: String,
});
module.exports = mongoose.model('Video', Video);

