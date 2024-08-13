const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const products = [
    { id: 1, name: "Product 1", price: 10.00 },
    { id: 2, name: "Product 2", price: 20.00 },
    { id: 3, name: "Product 3", price: 30.00 },
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
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
    res.status(201).json(newProduct);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

