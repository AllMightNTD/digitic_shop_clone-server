const Category = require('../models/prodCategoryModel');
const validateMongoDB = require('../utils/validateMongoDB');

const createCategory = async (req, res) => {
    console.log(req.body);
    try {
        const newCategory = await Category.create(req.body);
        res.json({
            status: 'success',
            newCategory,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: 'success',
            updateCategory,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json({
            status: 'success',
            deleteCategory,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getCategory = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const getCategory = await Category.findById(id);
        res.json({
            status: 'success',
            getCategory,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getAllCategory = async (req, res) => {
    try {
        const getAllcategory = await Category.find();
        res.json({
            status: 'success',
            getAllcategory,
        });
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory };
