const mongoose = require('mongoose')
const Chit = require('../models/chitModel.js')
const User = require('../models/userModel.js')

// GET all chits
const getAllChits = async (req, res) => {
    const allChits = await Chit.find({}).sort({createdAt : -1}).populate('user', 'name username pfp');
    const filtered = allChits.filter(chit => chit.user !== null);
    res.status(200).json(filtered);
}

// GET a single chit
const getChit = async (req, res) => {
    const {id} = req.params

    // checking if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error : "no such chit"})
    }

    const chit = await Chit.findById(id).populate('user', 'name username pfp')

    if (!chit) {
        return res.status(400).json({error : "no such chit"})
    }

    res.status(200).json(chit)
}

// POST a chit
const createChit = async (req, res) => {
    const {content} = req.body

    try {
        if (!content) {
            throw Error("Text field can't be empty")
        }
        const user_id = req.user._id
        const chit = await Chit.create({user: user_id, content});
        await chit.populate('user', 'name username pfp');
        res.status(200).json(chit)
    }
    catch(error) {
        res.status(400).json({error : error.message})
    }
}

// DELETE a chit
const deleteChit = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error : "no such chit"})
    }

    const chit = await Chit.findByIdAndDelete(id)

    if (!chit) {
        return res.status(400).json({error : "no such chit"})
    }

    res.status(200).json(chit)

}

// UPDATE a chit
const updateChit = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such chit"})
    }

    const chit = await Chit.findByIdAndUpdate(id, {
        ...req.body
    })

    if (!chit) {
        return res.status(404).json({error: "no such chit"})
    }

    res.status(200).json(chit)
}

// LIKE a chit
const likeChit = async (req, res) => {
  const userId = req.user._id; // logged-in user
  const { id } = req.params; // chit to like

  try {
    const targetChit = await Chit.findById(id);
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if (!targetChit) {
      return res.status(404).json({ error: "Target chit not found" });
    }

    if (targetChit.likes.includes(userId)) {
      // Already liked — so unlike
      await Chit.findByIdAndUpdate(id, { $pull: { likes: userId } });

      return res.status(200).json({ message: "Unliked chit" });
    } else {
      // Like chit
      await Chit.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

      return res.status(200).json({ message: "Liked chit" });
    }

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// export
module.exports = {
    getAllChits,
    getChit,
    createChit,
    deleteChit,
    updateChit,
    likeChit
}