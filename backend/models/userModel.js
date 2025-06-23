const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        default: 'pfp.png'
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// static signup method
userSchema.statics.signup = async function(name, username, password, password2, dob, location) {
    
    // validation
    if (!name || !username || !password || !dob || !location) {
        throw Error("All fields must be filled")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough")
    }

    if (password !== password2) {
        throw Error("Passwords not matching")
    }

    const exists = await this.findOne({ username })

    if (exists) {
        throw Error("Username already registered")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = this.create({name, username, password: hash, dob, location})
    return user
}

// static login method
userSchema.statics.login = async function(username, password) {
    if (!username || !password) {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({username})

    if (!user) {
        throw Error("Incorrect Username")
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("Incorrect Password")
    }

    return user
}

module.exports = mongoose.model('User', userSchema)