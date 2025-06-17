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
const User = require('../models/userModel');
const fs = require('fs')

// === Multer Storage Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pfp');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${req.params.id}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// === Upload Profile Picture & Delete Old ===
router.patch('/upload/:id', upload.single('pfp'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const oldPfp = user.pfp;

    // Update user profile picture
    user.pfp = req.file.filename;
    await user.save();

    // Delete old file if not default
    if (oldPfp && oldPfp !== 'pfp.png') {
      const oldPath = path.join(__dirname, '..', 'public', 'pfp', oldPfp);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Failed to delete old pfp:', err);
        }
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;