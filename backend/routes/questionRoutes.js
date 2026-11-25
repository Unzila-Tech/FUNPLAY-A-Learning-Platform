const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const authMiddleware = require("../middleware/authMiddleware");

const validLanguages = ["English", "Hindi", "Arabic"];
const validActivities = ["fillBlank", "emojiGuess", "vocabulary", "quiz"];

// GET /api/questions?language=English&lessonId=1&activityId=fillBlank
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { language, activityId } = req.query;
    const lessonId = Number(req.query.lessonId);
    if (!validLanguages.includes(language) || !validActivities.includes(activityId) || !Number.isInteger(lessonId) || lessonId < 1 || lessonId > 3) {
      return res.status(400).json({ message: "Valid language, lessonId (1-3) and activityId are required." });
    }
    const questions = await Question.find({
      language,
      activityId,
      $or: [{ lessonId }, { lessonId: null }]
    }).sort({ lessonId: 1, questionOrder: 1 }).lean();

    if (!questions.length) return res.status(404).json({ message: "No questions found for this activity." });
    // Existing Lesson.jsx currently compares question.answer on the client.
    // This response keeps compatibility with that UI. For a public production app,
    // move answer validation to a POST endpoint so answers are not sent to browsers.
    res.json(questions);
  } catch (error) {
    console.error("Question fetch error:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});
module.exports = router;
