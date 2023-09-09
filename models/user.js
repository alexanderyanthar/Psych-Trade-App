// Importing modules
const { Schema } = require('mongoose');
const mongoose = require('mongoose');

// Defining the user Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    // Referendcing the assessment scehma to keep track of the answers - be more verbose with the naming
    assessments: [{ type: Schema.Types.ObjectId, ref: 'AssessmentAnswer' }]
});

// creating the user model
const User = mongoose.model('User', userSchema);

// exporting the user model
module.exports = { User } ;
