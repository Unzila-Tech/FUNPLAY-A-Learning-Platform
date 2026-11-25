
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

// Update avatar
router.put("/avatar", authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;

    const allowedAvatars = [
      "🐼", "🦊", "🐸", "🐱", "🐰", "🐨",
      "🦄", "🐻", "🐯", "🐶", "🐵", "🦁"
    ];

    if (!allowedAvatars.includes(avatar)) {
      return res.status(400).json({
        message: "Invalid avatar"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Avatar updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update avatar"
    });
  }
});

// Update bio
router.put("/bio", authMiddleware, async (req, res) => {
  try {
    const { bio } = req.body;

    if (typeof bio !== "string" || bio.length > 120) {
      return res.status(400).json({
        message: "Bio must be a string of maximum 120 characters"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio: bio.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Bio updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update bio"
    });
  }
});

module.exports = router;
