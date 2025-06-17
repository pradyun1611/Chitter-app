const User = require('../models/userModel.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.login(username, password)

        // create token
        const token = createToken(user._id)
    
        res.status(200).json({_id: user._id, username, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {name, username, password, password2, dob, location} = req.body

    try {
        const user = await User.signup(name, username, password, password2, dob, location)

        // create token
        const token = createToken(user._id)
    
        res.status(200).json({_id: user._id, username, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// GET all users
const getAllUsers = async (req, res) => {
    const allUsers = await User.find({}).sort({created: -1})
    res.status(200).json(allUsers)
}

// GET single user
const getUser = async (req, res) => {
    const {id} = req.params
    
    // checking if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error : "no such user"})
    }

    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({error : "no such user"})
    }

    res.status(200).json(user)
}

// FOLLOW a user
const followUser = async (req, res) => {
  const userId = req.user._id; // logged-in user
  const { id } = req.params; // user to follow

  if (userId === id) {
    return res.status(400).json({ error: "Cannot follow yourself" });
  }

  try {
    const targetUser = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    if (targetUser.followers.includes(userId)) {
      // Already following — so unfollow
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: userId } });

      return res.status(200).json({ message: "Unfollowed user" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(userId, { $addToSet: { following: id } });
      await User.findByIdAndUpdate(id, { $addToSet: { followers: userId } });

      return res.status(200).json({ message: "Followed user" });
    }

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE a user
const updateUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"})
    }

    const user = await User.findByIdAndUpdate(id, {
        ...req.body
    })

    if (!user) {
        return res.status(404).json({error: "no such user"})
    }

    res.status(200).json(user)
}

// DELETE user
const deleteUser = async (req, res) => {
    const {id} = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error : "no such user"})
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
        return res.status(400).json({error : "no such user"})
    }

    res.status(200).json(user)
}

module.exports = { loginUser, signupUser, getAllUsers, getUser, followUser, updateUser, deleteUser }