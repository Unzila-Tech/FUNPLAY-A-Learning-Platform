
const User = require("../models/user");

const updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;

    const updates = {};

    if (typeof bio === "string") {
      if (bio.length > 120) {
        return res.status(400).json({
          message: "Bio cannot exceed 120 characters",
        });
      }

      updates.bio = bio.trim();
    }

    if (typeof avatar === "string") {
      const allowedAvatars = [
        "🐼", "🦊", "🐸", "🐱", "🐰", "🐨",
        "🦄", "🐻", "🐯", "🐶", "🐵", "🦁"
      ];

      if (!allowedAvatars.includes(avatar)) {
        return res.status(400).json({
          message: "Invalid avatar",
        });
      }

      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid profile fields provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = { updateProfile };
