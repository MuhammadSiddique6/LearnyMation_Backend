const express = require('express');
const { PythonShell } = require('python-shell');
const router = express.Router();
const QuizResult = require('./models/quiz');
const { verifytoken } = require('./middleware/verifytoken');

/**
 * @route POST /api/ai/predict
 * @desc Run the prediction model and return results from provided scores
 * @access Public
 */
router.post('/predict', async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Validate input
    if (!scores || !Array.isArray(scores) || scores.length !== 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of 5 scores (Math, Science, Logic Thinking, Creativity, Object Detection)' 
      });
    }
    
    // Validate that all scores are numbers between 1-5
    const validScores = scores.every(score => 
      typeof score === 'number' && score >= 1 && score <= 5
    );
    
    if (!validScores) {
      return res.status(400).json({ 
        success: false, 
        message: 'All scores must be numbers between 1 and 5' 
      });
    }

    // Options for PythonShell
    const options = {
      mode: 'json',
      pythonPath: 'python', // Use 'python3' if needed for your environment
      args: scores
    };

    // Create a modified version of the Python script that accepts arguments and returns JSON
    const pyshell = new PythonShell('predicted_api.py', options);
    
    let result = null;
    
    pyshell.on('message', (message) => {
      result = message;
    });
    
    await new Promise((resolve, reject) => {
      pyshell.end((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    if (!result) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get prediction results' 
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('AI Prediction Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during prediction',
      error: error.message
    });
  }
});

/**
 * @route GET /api/ai/prediction/:email
 * @desc Get AI prediction based on user's quiz scores from MongoDB
 * @access Private (requires authentication)
 */
router.get('/prediction/:email', verifytoken, async (req, res) => {
  try {
    const { email } = req.params;
    
    // Verify if the email from params matches the authenticated user's email
    if (req.email !== email) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this data'
      });
    }
    
    // Find the quiz result for this user
    const quizResult = await QuizResult.findOne({ email });
    
    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'No quiz results found for this user'
      });
    }
    
    // Extract scores from the quiz result and convert to array format for the Python script
    const scoresObj = quizResult.scores;
    const scoresArray = [
      scoresObj.Math || 0,
      scoresObj.Science || 0,
      scoresObj.LogicThinking || 0,
      scoresObj.Creativity || 0,
      scoresObj.ObjectDetection || 0
    ];
    
    // Options for PythonShell
    const options = {
      mode: 'json',
      pythonPath: 'python', // Use 'python3' if needed for your environment
      args: scoresArray
    };
    
    // Run the Python script with the user's scores
    const pyshell = new PythonShell('predicted_api.py', options);
    
    let result = null;
    
    pyshell.on('message', (message) => {
      result = message;
    });
    
    await new Promise((resolve, reject) => {
      pyshell.end((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get prediction results'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        ...result,
        quizCompletedCount: quizResult.quizCompletedCount,
        totalScore: quizResult.totalScore
      }
    });
    
  } catch (error) {
    console.error('AI Prediction Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during prediction',
      error: error.message
    });
  }
});

module.exports = router;
