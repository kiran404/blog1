const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const categoryRoute = require('./routes/category');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {authenticate} = require('./middlewares/authenticate.middleware')
require('dotenv').config();
require('./database/db')
// app
const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))

//routes
app.use('/api/auth', authRoute);
app.use('/api/user',authenticate, userRoute);
app.use('/api/post', authenticate, postRoute);
app.use('/api/category', categoryRoute);

app.listen("9000", () => {
    console.log('Server is Running');
})