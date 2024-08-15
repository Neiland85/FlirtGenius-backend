const paymentService = require('../services/paymentService');
const { body, validationResult } = require('express-validator');

exports.checkout = [
    body('items').isArray({ min: 1 }).withMessage('Items array is required and cannot be empty'),
    body('paymentInfo.cardNumber').isCreditCard().withMessage('Invalid card number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        const { items, paymentInfo } = req.body;
        try {
            const session = await paymentService.processPayment(items, paymentInfo);
            await paymentService.createTransaction(items);
            res.json({ id: session.id });
        } catch (error) {
            res.status(500).json({ message: 'Error processing payment' });
        }
    }
];

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await paymentService.getTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions' });
    }
};

