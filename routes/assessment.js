const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Assessment } = require('../models/assessment');
const { Question } = require('../models/question')
const { AssessmentAnswer } = require('../models/assessmentAnswer');
const { secretKey } = require('./auth');
const { User } = require('../models/user');

router.get('/assessment', async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required '});
        }

        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token'});
            }

            const userId = decodedToken.userId;
            const questions = await Question.find().populate('options.points');

            res.render('assessment', { questions } );
        })
    } catch (err) {
        console.error('Error fetching assessment questions:', err);
        res.status(500).send('Iternal Server Error');
    }
});

router.post('/submitAssessment', async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Authenticaion Required' });
        }

        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            const userId = decodedToken.userId;
            const user = await User.findById(userId);

            let fundamentalPoints = 0;
            let technicalPoints = 0;
            let hybridPoints = 0;
            let userPreference = '';

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

            const assessmentAnswers = new AssessmentAnswer({
                user: userId,
                userPreference: userPreference,
                assessmentResults: [
                    {type: 'fundamental', points: fundamentalPoints},
                    {type: 'technical', points: technicalPoints},
                    {type: 'hybrid', points: hybridPoints},
                ]
            });

            await assessmentAnswers.save();

            user.assessments.push(assessmentAnswers);
            await user.save();

            res.redirect('/profile');
        })
    } catch (err) {
        console.error('Error submitting assessment:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;