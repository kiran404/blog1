const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true,
    },
    photos: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);