const Transaction = require('../models/transaction');

exports.checkout = async (req, res) => {
  const { items, paymentInfo } = req.body;

  if (!items || !paymentInfo) {
    return res.status(400).json({ message: 'Items and payment information are required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    const transaction = new Transaction({
      items: items,
      totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
      paymentStatus: 'Pending',
    });

    await transaction.save();

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
};

