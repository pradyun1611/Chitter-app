const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chitSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
}, { timestamps : true });

module.exports = mongoose.model('Chit', chitSchema);
