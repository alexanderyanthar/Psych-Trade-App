const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    type: String,
    options: [{
        text: String,
        points: {
            type: Number
        },
    }],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };