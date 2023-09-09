// Importing module
const mongoose = require('mongoose');

// defining the question schema
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

// Creating the question model based on the question schema
const Question = mongoose.model('Question', questionSchema);

// exporting the question model
module.exports = { Question };
