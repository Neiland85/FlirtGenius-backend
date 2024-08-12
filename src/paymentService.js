const Transaction = require('../models/transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createTransaction = async (items) => {
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const transaction = new Transaction({
    items,
    totalAmount,
    paymentStatus: 'Pending',
  });
  return await transaction.save();
};

const processPayment = async (items, paymentInfo) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });
  return session;
};

const getTransactions = async () => {
  return await Transaction.find();
};

module.exports = {
  createTransaction,
  processPayment,
  getTransactions,
};

