const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  email: { type: String, required: true }, 
  scores: {
    Math: { type: Number, default: 0 },
    Science: { type: Number, default: 0 },
    Creativity: { type: Number, default: 0 },
    LogicThinking: { type: Number, default: 0 },
    ObjectDetection: { type: Number, default: 0 },
  },
  acheivements: { type: Number, default: 0 }, // Number of achievements unlocked
  totalScore: { type: Number, required: true },
  quizCompletedCount: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
