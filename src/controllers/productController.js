const productService = require('../services/productService');

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, image, stock } = req.body;
  if (!name || !description || !price || !image || !stock) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const savedProduct = await productService.createProduct(req.body);
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

