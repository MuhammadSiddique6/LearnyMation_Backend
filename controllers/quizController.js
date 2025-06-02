const QuizResult = require("../models/quiz");
const User = require("../models/user");

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

exports.quiz = async (req, res) => {
  try {
    const userId = req.userId; 
    const email = req.email; // extracted from JWT
    const { scores, totalScore } = req.body;
    console.log(userId,email);
    let result = await QuizResult.findOne({ email });

    if (result) {
      // Update existing result
      result.totalScore += Number(totalScore);
      result.quizCompletedCount += 1;

      // Update scores safely
      for (const category in scores) {
        if (result.scores.hasOwnProperty(category)) {
          result.scores[category] += Number(scores[category]);
        } else {
          // in case a new category appears
          result.scores[category] = Number(scores[category]);
        }
      }

      await result.save();
    } else {
      // Create new result
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
      });

      await result.save();
    }

    // Update user streak and quizzesCompleted
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const streakUpdate = updateStreak(user.lastActivityDate);

    if (streakUpdate === 1) {
      user.streak = 1; // reset streak
    } else if (streakUpdate === null) {
      user.streak += 1; // increment streak
    }
    // if streakUpdate === -1, do nothing (same day)

    user.points += Number(totalScore);
    user.lastActivityDate = new Date();
    user.quizzesCompleted += 1;

    await user.save();

    return res.status(200).json({ message: "Quiz saved and user updated", result });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ error: "Server error" });
  }
};