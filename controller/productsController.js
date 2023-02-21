const Product = require('../models/productModel');
const slugify = require('slugify');
const createProduct = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json({ newProduct });
    } catch (error) {
        throw new Error(error.message);
    }
};
const updateProduct = async (req, res) => {
    const id = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, { new: true });
        res.json({ updateProduct });
    } catch (error) {
        throw new Error(error.message);
    }
};
const getAproduct = async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json({ findProduct });
    } catch (error) {
        throw new Error(error);
    }
};
const getAllProducts = async (req, res) => {
    const queryObj = { ...req.query };
    console.log(queryObj);
    // const getAllProducts = await Product.Where("category").equals(req.query.category)
    try {
        const allProducts = await Product.find();
        res.json({ allProducts });
    } catch (error) {
        throw new Error(error);
    }
};
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json({ deleteProduct });
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createProduct, getAproduct, getAllProducts, updateProduct, deleteProduct };
