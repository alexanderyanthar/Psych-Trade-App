// Importing modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Assessment } = require('../models/assessment');
const { Question } = require('../models/question')
const { AssessmentAnswer } = require('../models/assessmentAnswer');
const { secretKey } = require('./auth');
const { User } = require('../models/user');

// Setting a get request the assessment endpoint
router.get('/assessment', async (req, res) => {
    try {
        // declaring json web token
        const token = req.cookies.jwt;

        // Error handling if there is no token
        if (!token) {
            return res.status(401).json({ message: 'Authentication required '});
        }

        // Verifying token
        jwt.verify(token, secretKey, async (err, decodedToken) => {
            // if not verified, return error
            if (err) {
                return res.status(403).json({ message: 'Invalid token'});
            }
            // if verified, decode token and populate assessment for user
            const userId = decodedToken.userId;
            const questions = await Question.find().populate('options.points');

            res.render('assessment', { questions } );
        })
    } catch (err) {
        console.error('Error fetching assessment questions:', err);
        res.status(500).send('Iternal Server Error');
    }
});

// post request for submitting assessment
router.post('/submitAssessment', async (req, res) => {
    try {
        // declaring jwt in variable
        const token = req.cookies.jwt;

        // if no token available, send error through 401
        if (!token) {
            return res.status(401).json({ message: 'Authenticaion Required' });
        }

        // if there is a token, verify it
        jwt.verify(token, secretKey, async (err, decodedToken) => {
            // if token is not verified, return error
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            // else decode token and find the user through their ID
            const userId = decodedToken.userId;
            const user = await User.findById(userId);

            // set points to 0 at the beginnign of the test along with the user preference
            let fundamentalPoints = 0;
            let technicalPoints = 0;
            let hybridPoints = 0;
            let userPreference = '';

            // for each option per question (3 options per question) set apporpriate points
            for (const questionId in req.body) {
                const selectedOptionPoints = parseInt(req.body[questionId]);
                if (selectedOptionPoints === 1) {
                    fundamentalPoints += 1;
                } else if (selectedOptionPoints === 2) {
                    technicalPoints += 1;
                } else if (selectedOptionPoints === 3) {
                    hybridPoints += 1;
                }
            }

            // depending on what the result is (after the final 10 questions) whatever has the most points will be the user preference
            if (fundamentalPoints > technicalPoints && fundamentalPoints > hybridPoints) {
                userPreference = 'fundamental';
            } else if (technicalPoints > fundamentalPoints && technicalPoints > hybridPoints) {
                userPreference = 'technical';
            } else if (hybridPoints > fundamentalPoints && hybridPoints > technicalPoints || fundamentalPoints === technicalPoints) {
                userPreference = 'hybrid';
            } else if (fundamentalPoints === hybridPoints) {
                userPreference = 'hybrid-fundamnetal';
            } else if (technicalPoints === hybridPoints) {
                userPreference = 'hybrid-technical';
            }

            // when that's complete, create a new user Assessment associated with the user
            const assessmentAnswers = new AssessmentAnswer({
                user: userId,
                userPreference: userPreference,
                assessmentResults: [
                    {type: 'fundamental', points: fundamentalPoints},
                    {type: 'technical', points: technicalPoints},
                    {type: 'hybrid', points: hybridPoints},
                ]
            });

            // save the answers, push them to the user model, and then save the user.
            await assessmentAnswers.save();

            user.assessments.push(assessmentAnswers);
            await user.save();

            // Redirect user back to their profile
            res.redirect('/profile');
        })
    } catch (err) {
        console.error('Error submitting assessment:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Export router for assessments
module.exports = router;
