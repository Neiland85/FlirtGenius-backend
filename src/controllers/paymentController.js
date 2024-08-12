const paymentService = require('../services/paymentService');

exports.checkout = async (req, res) => {
  const { items, paymentInfo } = req.body;
  if (!items || !paymentInfo) {
    return res.status(400).json({ message: 'Items and payment information are required' });
  }
  try {
    const session = await paymentService.processPayment(items, paymentInfo);
    await paymentService.createTransaction(items);
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await paymentService.getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
};

