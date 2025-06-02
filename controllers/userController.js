// controllers/childrenController.js
const User = require("../models/user");
exports.children = async (req, res) => {
  try {
    const user = req.email;
    const l = await User.findOne({ email: user });
    console.log("User found:", user);
    if (!l) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    res.json({
      name: l.name,
      points: l.points,
      streak: l.streak,
      level: l.level,
      quizzesCompleted: l.quizzesCompleted,
      videosWatched: l.videosWatched,
      gamesPlayed: l.gamesPlayed,
      achievements: l.achievements,
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};
