
const express = require("express");
const router = express.Router();

const Progress = require("../models/progress");
const authMiddleware = require("../middleware/authMiddleware");

const validLanguages = ["English", "Hindi", "Arabic"];
const validActivities = [
  "fillBlank",
  "emojiGuess",
  "vocabulary",
  "quiz",
];

// GET: fetch only the logged-in user's progress
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.userId,
    }).sort({ language: 1, lessonId: 1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch progress",
    });
  }
});

// POST: save or update an activity's progress
router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const { language, lessonId, activityId, score } = req.body;

    if (
      !validLanguages.includes(language) ||
      !validActivities.includes(activityId) ||
      !Number.isInteger(lessonId) ||
      lessonId < 1 ||
      lessonId > 3 ||
      !Number.isFinite(score) ||
      score < 0
    ) {
      return res.status(400).json({
        message: "Invalid progress data",
      });
    }

   
const progress = await Progress.findOneAndUpdate(
  { userId: req.userId, language, lessonId, activityId },
  {
    $set: {
      completed: true,
      score,
      updatedAt: new Date(),
    },
  },
  {
    returnDocument: "after",
    upsert: true,
    runValidators: true,
  }
);
    res.json({
      message: "Progress saved",
      progress,
    });
  } catch (error) {
  console.error("SAVE PROGRESS ERROR:", error);

  res.status(500).json({
    message: "Unable to save progress",
    error: error.message,
  });

  }
});

module.exports = router;
