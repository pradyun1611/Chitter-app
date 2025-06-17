const express = require('express')

const router = express.Router()
const chitController = require('../controllers/chitsController.js')

const requireAuth = require('../middleware/requireAuth.js')

router.use(requireAuth)

// GET all chits
router.get('/', chitController.getAllChits)

// GET a single chit
router.get('/:id', chitController.getChit)

// POST a chit
router.post('/', chitController.createChit)

// DELETE a chit
router.delete('/:id', chitController.deleteChit)

// UPDATE a chit
router.patch('/:id', chitController.updateChit)

// LIKE a chit
router.post('/like/:id', chitController.likeChit)

module.exports = router