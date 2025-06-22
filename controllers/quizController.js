const QuizResult = require("../models/quiz");
const User = require("../models/user");

// ─── Update streak logic ─────────────────────────────────────────────────────
const updateStreak = (lastDate) => {
  if (!lastDate) return 1; // First activity

  const now = new Date();
  const last = new Date(lastDate);

  const diffTime = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return null; // Increment streak
  } else if (diffDays > 1) {
    return 1; // Reset streak
  } else {
    return -1; // Same day, no change
  }
};

// ─── Determine level from total points ───────────────────────────────────────
const determineLevel = (points) => {
  if (points >= 400) return 5;
  if (points >= 300) return 4;
  if (points >= 200) return 3;
  if (points >= 100) return 2;
  return 1;
};

// ─── Unlock achievement if a new level is reached ────────────────────────────
const levelAchievementMap = {
  2: 'Beginner',
  3: 'Expert',
  4: 'Master',
  5: 'Professional',
};

const unlockAchievementForLevel = (user, level) => {
  const achName = levelAchievementMap[level];
  if (!achName) return;

  let achievement = user.achievements.find((a) => a.name === achName);

  if (!achievement) {
    achievement = user.achievements.find((a) => a.name === 'Locked');
    if (achievement) {
      achievement.name = achName;
    } else {
      achievement = { name: achName };
      user.achievements.push(achievement);
    }
  }

  achievement.unlocked = true;
};

// ─── Main quiz controller ────────────────────────────────────────────────────
exports.quiz = async (req, res) => {
  try {
    const userId = req.userId; 
    const email = req.email; // extracted from JWT
    const { scores, totalScore, timeSpent } = req.body;
    console.log(userId, email);

    // ─── Save/update Quiz Result ─────────────────────────────────────────────
    let result = await QuizResult.findOne({ email });

    if (result) {
      result.totalScore += Number(totalScore);
      result.quizCompletedCount += 1;
result.timeSpent += Number(timeSpent);

      for (const category in scores) {
        if (result.scores.hasOwnProperty(category)) {
          result.scores[category] += Number(scores[category]);
        } else {
          result.scores[category] = Number(scores[category]);
        }
      }

      await result.save();
    } else {
      result = new QuizResult({
        email,
        scores: {
          Math: Number(scores.Math) || 0,
          Science: Number(scores.Science) || 0,
          Creativity: Number(scores.Creativity) || 0,
          LogicThinking: Number(scores.LogicThinking) || 0,
          ObjectDetection: Number(scores.ObjectDetection) || 0,
        },
        totalScore: Number(totalScore),
        quizCompletedCount: 1,
        timeSpent,
      });

      await result.save();
    }

    // ─── Update user profile: streak, level, achievements ────────────────────
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const streakUpdate = updateStreak(user.lastActivityDate);

    if (streakUpdate === 1) {
      user.streak = 1;
    } else if (streakUpdate === null) {
      user.streak += 1;
    }

    user.points += Number(totalScore);
    const newLevel = determineLevel(user.points);

    if (newLevel > user.level) {
      user.level = newLevel;
      unlockAchievementForLevel(user, newLevel);
    }

    user.lastActivityDate = new Date();
    user.quizzesCompleted += 1;

    await user.save();

    return res.status(200).json({ message: "Quiz saved and user updated", result });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ error: "Server error" });
  }
};
