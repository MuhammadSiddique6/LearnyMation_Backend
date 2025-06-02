const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/auth");

exports.verifytoken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Unauthorized user. Token not provided." });
  }

  const bearerToken = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(bearerToken, process.env.SECRET_KEY);

    if (!decodedToken.email) {
      return res.status(401).json({ message: "Unauthorized: User email not found in token" });
    }

    req.email = decodedToken.email; // ✅ assign email
    req.userId = decodedToken.userId; // ✅ fix typo here

    const user = await User.findOne({ email: decodedToken.email });

    if (!user || user.token !== bearerToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token (mismatch).",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
