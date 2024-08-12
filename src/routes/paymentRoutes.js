const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/checkout', paymentController.checkout);
router.get('/transactions', paymentController.getTransactions);

module.exports = router;

