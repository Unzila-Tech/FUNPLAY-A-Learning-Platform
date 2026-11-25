
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    language: {
      type: String,
      enum: ["English", "Hindi", "Arabic"],
      required: true,
    },

    lessonId: {
      type: Number,
      required: true,
    },

    activityId: {
      type: String,
      enum: ["fillBlank", "emojiGuess", "vocabulary", "quiz"],
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One progress record per user, lesson and activity.
progressSchema.index(
  { userId: 1, language: 1, lessonId: 1, activityId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Progress", progressSchema);
