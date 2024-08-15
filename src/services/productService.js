const Product = require('../models/product');

const getProductsPaginated = async (page, limit) => {
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalItems = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    return {
        products,
        totalItems,
        totalPages,
        currentPage: page,
    };
};
const getAllProducts = async () => {
  return await Product.find();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
    getProductsPaginated,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
