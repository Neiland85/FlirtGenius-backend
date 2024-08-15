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
    additionalLabels: ['method', 'status'],
    normalizeStatus: status => status < 400 ? 'success' : 'error',
}));

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Middleware para manejo de errores
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Endpoints y otras configuraciones...
// (Incluye aquí tus rutas de productos y pagos)

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

