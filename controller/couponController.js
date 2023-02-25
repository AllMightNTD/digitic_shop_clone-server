const Coupon = require('../models/couponModel');
const validateMongoDB = require('../utils/validateMongoDB');
const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.json({
            status: 'success',
            coupon,
        });
    } catch (err) {
        next(err);
    }
};

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.json({
            status: 'success',
            coupons,
        });
    } catch (err) {
        next(err);
    }
};

const updateCoupon = async (req, res, next) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            status: 'success',
            updateCoupon,
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteCoupon = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json({
            status: 'success',
            deleteCoupon,
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createCoupon, updateCoupon, getAllCoupons, deleteCoupon };
