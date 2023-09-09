// Importing modules
const mongoose = require('mongoose');
const { Question } = require('./question');
const { Answer } = require('./answer');

// Defining assessment schema
const assessmentSchema = new mongoose.Schema({
    name: String,
    assessmentType: {
        type: String,
        enum: ['Analysis', 'TypeOfTrader', 'CognitiveBias'],
        required: true,
    },
    // using the question and answer schema to populate the assessment schema
    questions: [Question.schema],
    answers: [Answer.schema],
});

// Creating and declaring the assessment schema
const Assessment = mongoose.model('Assessment', assessmentSchema);

// exporting the assessment model
module.exports = { Assessment };
