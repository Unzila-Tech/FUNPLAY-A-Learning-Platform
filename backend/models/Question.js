const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  language: { type: String, enum: ["English", "Hindi", "Arabic"], required: true, index: true },
  // null means a shared set used by every lesson (currently Quiz).
  lessonId: { type: Number, default: null, index: true },
  activityId: { type: String, enum: ["fillBlank", "emojiGuess", "vocabulary", "quiz"], required: true, index: true },
  questionOrder: { type: Number, required: true },
  difficulty: { type: String, enum: ["basic", "beginner", "easy", "medium", "intermediate", "advanced", "hard"], default: "beginner" },
  questionType: { type: String, enum: ["mcq", "emoji-basic", "emoji-match", "emoji-sentence", "vocabulary"], default: "mcq" },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
  answer: { type: mongoose.Schema.Types.Mixed, default: null },
  hint: { type: String, default: "" },
  hindiTranslation: { type: String, default: "" },
  englishTranslation: { type: String, default: "" },
  hindiMeaning: { type: String, default: "" },
  emoji: { type: String, default: "" },
  cards: { type: [mongoose.Schema.Types.Mixed], default: [] },
  pairs: { type: [mongoose.Schema.Types.Mixed], default: [] },
  answerMap: { type: mongoose.Schema.Types.Mixed, default: null },
  voiceText: { type: String, default: "" },
  topic: { type: String, default: "" },
  shared: { type: Boolean, default: false }
}, { timestamps: true });

questionSchema.index({ language: 1, lessonId: 1, activityId: 1, questionOrder: 1 }, { unique: true });
module.exports = mongoose.model("Question", questionSchema);
