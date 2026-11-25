require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("../models/Question");
const questions = require("./questions");

async function seedQuestions() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in backend/.env");
    await mongoose.connect(process.env.MONGO_URI);
    // Idempotent: running this file again updates the same question records,
    // it does not create duplicate copies.
    const operations = questions.map((q) => ({
      updateOne: {
        filter: { language: q.language, lessonId: q.lessonId ?? null, activityId: q.activityId, questionOrder: q.questionOrder },
        update: { $set: q },
        upsert: true
      }
    }));
    const result = await Question.bulkWrite(operations, { ordered: false });
    console.log("Question seed complete:", result);
  } catch (error) {
    console.error("Question seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seedQuestions();
