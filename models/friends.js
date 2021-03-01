const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Friends = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
     },
    frends: {type: Array} 
    
});

module.exports = mongoose.model('Friends', Friends);