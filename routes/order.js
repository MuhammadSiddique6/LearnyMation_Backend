const express = require('express');
const router = express.Router();
const order = require('../controllers/orderController');
const { verifytoken } = require('../middleware/verifytoken');

router.post('/',verifytoken, order.Order);

module.exports = router;