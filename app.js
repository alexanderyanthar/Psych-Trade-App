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

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', assessmentRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
