const express = require("express")
const {verifytoken} = require('../middleware/verifytoken');
const router = express.Router();
const quiz = require("../controllers/quizController")

router.post("/",verifytoken,quiz.quiz);
module.exports = router;