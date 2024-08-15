const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prometheusMiddleware = require('express-prometheus-middleware');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch(err => {
    logger.error('MongoDB connection error', err.message);
    process.exit(1);
});

app.use(bodyParser.json());
app.use(prometheusMiddleware({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    metricsApp: app,
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Models
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    stock: { type: Number, required: true, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const transactionSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.post('/checkout', [
    body('products').isArray().withMessage('Debe enviar un arreglo de productos'),
    body('token').not().isEmpty().withMessage('El token es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { products, token } = req.body;

        const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

        const charge = await stripe.charges.create({
            amount: totalAmount * 100, // Stripe works in cents
            currency: 'usd',
            description: 'Compra de productos',
            source: token,
        });

        const transaction = new Transaction({
            products: products.map(product => ({
                productId: product.id,
                quantity: product.quantity
            })),
            amount: totalAmount,
            transactionId: charge.id,
            status: charge.status
        });

        await transaction.save();

        res.status(201).json({ message: 'Pago exitoso', charge });
    } catch (err) {
        logger.error('POST /checkout - Error en el pago', err);
        res.status(500).json({ message: 'Error en el proceso de pago' });
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        logger.error('GET /transactions - Error fetching transactions', err);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.get('/api/hello', (req, res) => {
    logger.info('GET /api/hello - Sending hello message');
    res.send('Hello KAZEM team!!');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

