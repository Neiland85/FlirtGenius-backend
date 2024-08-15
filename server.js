const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const prometheusMiddleware = require('express-prometheus-middleware');
const morgan = require('morgan');
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

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Post = mongoose.model('Post', postSchema);

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        logger.error('GET /users - Error fetching users', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        logger.error('POST /users - Error creating user', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.json(posts);
    } catch (err) {
        logger.error('GET /posts - Error fetching posts', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        logger.error('POST /posts - Error creating post', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/hello', (req, res) => {
    logger.info('GET /api/hello - Sending hello message');
    res.send('Hello KAZEM team!!');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

