// Importing necessary modules
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { router: authRouter } = require('./routes/auth');
const assessmentRouter = require('./routes/assessment');

// Getting express to join static files from the public folder for displaying on browswer
app.use(express.static(path.join(__dirname, 'public')));

// defining port and mongo URI connections with environment variables
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Setting up EJS enging and pathing.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// parsing both json and cookies to make proper use of data and also encoding urls. 
// Enabling cors for cross browswer functionality
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// connecting both the authentication pathways and assessment pathways (assessment is to the mongo cloud database)
app.use('/', authRouter);
app.use('/', assessmentRouter);

// Getting app to listen to open port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
