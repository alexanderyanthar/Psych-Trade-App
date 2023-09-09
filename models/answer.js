// Importing modules
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Defining the answer schema
const answerSchema = new mongoose.Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: String,
})

// Creating the answer schema and assinging the variable Answer
const Answer = mongoose.model('Answer', answerSchema);

// Exporting schema
module.exports = { Answer };
