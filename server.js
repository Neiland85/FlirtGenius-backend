const express = require('express');
const bodyParser = require('body-parser'); // Necesario para manejar solicitudes JSON
const winston = require('winston'); // Paquete de logging
const app = express();
const port = process.env.PORT || 3000;

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

app.use(bodyParser.json());

const products = [
    { id: 1, name: "Product 1", price: 10.00 },
    { id: 2, name: "Product 2", price: 20.00 },
    { id: 3, name: "Product 3", price: 30.00 },
];

app.get('/products', (req, res) => {
    logger.info('GET /products - Fetching all products');
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        logger.info(`GET /products/${req.params.id} - Fetching product with ID ${req.params.id}`);
        res.json(product);
    } else {
        logger.warn(`GET /products/${req.params.id} - Product not found`);
        res.status(404).send("Product not found");
    }
});

app.post('/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    logger.info('POST /products - New product created', { product: newProduct });
    res.status(201).json(newProduct);
});

app.get('/api/hello', (req, res) => {
    logger.info('GET /api/hello - Sending hello message');
    res.send('Hello KAZEM team!!');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

