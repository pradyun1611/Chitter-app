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
const User = require('../models/userModel');
const { storage, cloudinary } = require('../utils/cloudinary');
const upload = multer({ storage });

router.patch('/upload/:id', upload.single('pfp'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const oldPfpUrl = user.pfp;

    // ✅ Save new Cloudinary image URL
    user.pfp = req.file.path; // This is the Cloudinary secure_url
    await user.save();

    // ✅ Delete old image from Cloudinary if it was not the default
    if (oldPfpUrl && !oldPfpUrl.includes('default_pfp')) {
      const segments = oldPfpUrl.split('/');
      const publicIdWithExtension = segments[segments.length - 1];
      const publicId = 'pfp/' + publicIdWithExtension.split('.')[0]; // remove extension
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;