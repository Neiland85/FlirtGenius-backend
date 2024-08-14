const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const prometheusMiddleware = require('express-prometheus-middleware');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001; // Cambiamos el puerto a 3001

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

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch(err => {
    logger.error('MongoDB connection error', err);
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

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: String,
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        logger.info('GET /products - Fetched all products');
        res.json(products);
    } catch (err) {
        logger.error('GET /products - Error fetching products', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            logger.warn(`GET /products/${req.params.id} - Product not found`);
            return res.status(404).json({ message: 'Product not found' });
        }
        logger.info(`GET /products/${req.params.id} - Fetched product with ID ${req.params.id}`);
        res.json(product);
    } catch (err) {
        logger.error(`GET /products/${req.params.id} - Error fetching product`, err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            stock: req.body.stock
        });
        await newProduct.save();
        logger.info('POST /products - New product created', { product: newProduct });
        res.status(201).json(newProduct);
    } catch (err) {
        logger.error('POST /products - Error creating product', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            logger.warn(`PUT /products/${req.params.id} - Product not found`);
            return res.status(404).json({ message: 'Product not found' });
        }
        logger.info(`PUT /products/${req.params.id} - Updated product with ID ${req.params.id}`);
        res.json(product);
    } catch (err) {
        logger.error(`PUT /products/${req.params.id} - Error updating product`, err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            logger.warn(`DELETE /products/${req.params.id} - Product not found`);
            return res.status(404).json({ message: 'Product not found' });
        }
        logger.info(`DELETE /products/${req.params.id} - Deleted product with ID ${req.params.id}`);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        logger.error(`DELETE /products/${req.params.id} - Error deleting product`, err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/checkout', async (req, res) => {
    const { products, paymentInfo } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(product => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100, // Convertir a centavos
                },
                quantity: product.quantity,
            })),
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        logger.info('POST /checkout - Payment processed successfully', { session });
        res.json({ id: session.id });
    } catch (err) {
        logger.error('POST /checkout - Error processing payment', err);
        res.status(500).json({ message: 'Payment processing failed' });
    }
});

app.get('/api/hello', (req, res) => {
    logger.info('GET /api/hello - Sending hello message');
    res.send('Hello KAZEM team!!');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

