const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: String,
  unlocked: Boolean,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  quizzesCompleted: { type: Number, default: 0 },
  videosWatched: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: null },
  achievements: { 
    type: [achievementSchema], 
    default: [
      { name: 'Trainee', unlocked: false },
      { name: 'Beginner', unlocked: false },
      { name: 'Expert', unlocked: false },
      { name: 'Master', unlocked: false },
      { name: 'Professional', unlocked: false },
    ] 
  },
  token: { type: String }, // Store JWT token if needed (optional)
});

module.exports = mongoose.model('User', userSchema);
