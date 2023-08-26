const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: String,
})

const Answer = mongoose.model('Answer', answerSchema);

module.exports = { Answer };