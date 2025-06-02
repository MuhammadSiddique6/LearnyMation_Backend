const user = require('../controllers/userController');
const {verifytoken} = require('../middleware/verifytoken');
const express = require('express');
const router = express.Router();
const progress = require('../controllers/progressController');

router.get('/dashboard', verifytoken, user.children);
router.get('/educationdashboard', verifytoken, progress.getProgress);


module.exports = router