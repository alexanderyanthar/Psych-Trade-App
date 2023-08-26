const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
require('dotenv').config()
const crypto = require('crypto');

const generateRandomSecretKey = (length) => {
    const randomBytes = crypto.randomBytes(length);
    return randomBytes.toString('base64');
};

const secretKey = generateRandomSecretKey(32);

router.get('/signup', (req, res) => {
    let errorMessage = '';
    res.render('signup', { errorMessage });
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        let errorMessage = '';

        // Check username validity
        if (username.length < 6 || !/^[a-zA-Z0-9]+$/.test(username)) {
            errorMessage = 'Invalid username or password';
        } else if (password.length < 8 || !/(?=.*[0-9])(?=.*[@#$%^&+=]).*$/.test(password)) {
            errorMessage = 'Invalid username or password';
        }


        // If there's an error message, render the signup page with the error message
        if (errorMessage) {
            return res.status(400).render('signup', { errorMessage });
        }

        // Continue with signup process
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            errorMessage = 'Username already taken';
            return res.status(400).render('signup', { errorMessage });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

        // Redirect to the profile page after successful signup
        res.redirect('/profile');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
});

router.get('/login', (req, res) => {
    let errorMessage = '';
    res.render('login', { errorMessage });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let errorMessage = '';

        const user = await User.findOne({ username });
        if (!user) {
            errorMessage = 'Invalid username or password';
        }

        // Compare the entered password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            errorMessage = 'Invalid username or password';
        }

        if (errorMessage) {
            return res.status(400).render('login', { errorMessage });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

        // Redirect to the profile page after successful login
        res.redirect('/profile');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/profile', (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        jwt.verify(token, secretKey, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            const userId = decodedToken.userId;
            const user = await User.findById(userId).populate({
                path: 'assessments',
                model: 'AssessmentAnswer',
            });

            const hasTakenAssessment = user.assessments.length > 0;
            let userPreference = '';

            if (hasTakenAssessment) {
                userPreference = user.assessments[0].userPreference;
            }

            res.render('profile', { username: user.username, hasTakenAssessment, userPreference });
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
})

module.exports = { router, secretKey };