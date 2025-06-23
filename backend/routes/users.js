const userController = require('../controllers/usersController')

const express = require('express')

const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

// login
router.post('/login', userController.loginUser)

// signup
router.post('/signup', userController.signupUser)

router.use(requireAuth)

// GET all users
router.get('/', userController.getAllUsers)

// GET single user
router.get('/:id', userController.getUser)

// FOLLOW a user
router.post('/follow/:id', userController.followUser)

// UPDATE a user
router.patch('/:id', userController.updateUser)

// DELETE user
router.delete('/:id', userController.deleteUser)

// UPLOAD pfp
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const { storage } = require('../utils/cloudinary'); // ✅ NEW
const upload = multer({ storage }); // ✅ Cloudinary storage now

// === Upload Profile Picture to Cloudinary ===
router.patch('/upload/:id', upload.single('pfp'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const oldPfp = user.pfp;

    // ✅ Save the Cloudinary URL
    user.pfp = req.file.path; // This will be a public CDN URL
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;