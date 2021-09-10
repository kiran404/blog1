const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog')
    .then(console.log("Database Connected"))

