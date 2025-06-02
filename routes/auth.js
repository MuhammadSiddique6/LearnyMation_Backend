const auth = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/signup', auth.signup);
router.post('/signin', auth.signin);

module.exports = router;