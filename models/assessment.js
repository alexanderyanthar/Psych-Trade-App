const mongoose = require('mongoose');
const { Question } = require('./question');
const { Answer } = require('./answer');

const assessmentSchema = new mongoose.Schema({
    name: String,
    assessmentType: {
        type: String,
        enum: ['Analysis', 'TypeOfTrader', 'CognitiveBias'],
        required: true,
    },
    questions: [Question.schema],
    answers: [Answer.schema],
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = { Assessment };