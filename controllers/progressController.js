const Quiz = require('../models/quiz');
const User = require('../models/user');

exports.getProgress = async (req, res) => {
  const userEmail = req.email;

  if (!userEmail) {
    return res.status(401).json({ message: 'Unauthorized: User email not found in token' });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User found:", user._id);
    console.log("User email:", user.email);

    const quizRecords = await Quiz.find({ email: userEmail });

const totalQuizzes = quizRecords.reduce((sum, q) => sum + (q.quizCompletedCount || 0), 0);
    const totalTimeSpent = quizRecords.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
    const totalScoreSum = quizRecords.reduce((sum, q) => sum + (q.totalScore || 0), 0);
console.log(totalQuizzes)
    const averageScorePercentage = totalQuizzes > 0
  ? Math.min((totalScoreSum / (totalQuizzes * 25)) * 100, 100)
  : 0;


    // Accumulate raw scores
    const categoryTotalsRaw = {
      Math: 0,
      Science: 0,
      Creativity: 0,
      LogicThinking: 0,
      ObjectDetection: 0,
    };

    quizRecords.forEach((q) => {
      if (q.scores) {
        categoryTotalsRaw.Math += q.scores.Math || 0;
        categoryTotalsRaw.Science += q.scores.Science || 0;
        categoryTotalsRaw.Creativity += q.scores.Creativity || 0;
        categoryTotalsRaw.LogicThinking += q.scores.LogicThinking || 0;
        categoryTotalsRaw.ObjectDetection += q.scores.ObjectDetection || 0;
      }
    });

    // Normalize each category score by (5 * totalQuizzes)
    const divisor = totalQuizzes * 5 || 1; // prevent divide by zero

    const categoryTotals = {
      Math: (categoryTotalsRaw.Math / divisor).toFixed(2),
      Science: (categoryTotalsRaw.Science / divisor).toFixed(2),
      Creativity: (categoryTotalsRaw.Creativity / divisor).toFixed(2),
      LogicThinking: (categoryTotalsRaw.LogicThinking / divisor).toFixed(2),
      ObjectDetection: (categoryTotalsRaw.ObjectDetection / divisor).toFixed(2),
    };

    res.json({
      name: user.name,
      quizzesCompleted: user.quizzesCompleted || totalQuizzes,
      timeSpentInSeconds: totalTimeSpent,
      averageScorePercentage: averageScorePercentage.toFixed(2),
      achievements: user.achievements || [],
      totalScoresBySubject: categoryTotals,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
