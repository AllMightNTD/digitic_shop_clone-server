const Brand = require('../models/prodBrandModel');
const validateMongoDB = require('../utils/validateMongoDB');

const createBrand = async (req, res) => {
    console.log(req.body);
    try {
        const newBrand = await Brand.create(req.body);
        res.json({
            status: 'success',
            newBrand,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateBrand = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: 'success',
            updateBrand,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const deleteBrand = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json({
            status: 'success',
            deleteBrand,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getBrand = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const getBrand = await Brand.findById(id);
        res.json({
            status: 'success',
            getBrand,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const getAllBrand = async (req, res) => {
    try {
        const getAllBrand = await Brand.find();
        res.json({
            status: 'success',
            getAllBrand,
        });
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand };
