require('dotenv').config()

const express = require('express')
const chitRoutes = require('./routes/chits.js')
const userRoutes = require('./routes/users.js')
const path = require('path')

const mongoose = require('mongoose')

// app
const app = express()

// middleware
app.use(express.json())
app.use('/pfp', express.static(path.join(__dirname, 'public/pfp')));

//routes
app.use('/chit', chitRoutes)
app.use('/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen
        app.listen(process.env.PORT, () => {
            console.log(`connected to database & listening on port ${process.env.PORT}...`);
        })
    })
    .catch((err) => {
        console.log(err);
    })