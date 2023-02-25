const express = require('express');
const { createCoupon, updateCoupon, getAllCoupons, deleteCoupon } = require('../controller/couponController');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();

// Chỉ có admin mới có quyền tạo ,lấy sản phẩm
router.post('/', authMiddelware.authMiddleware, authMiddelware.isAdmin, createCoupon);
router.put('/update/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, updateCoupon);
router.get('/all', authMiddelware.authMiddleware, authMiddelware.isAdmin, getAllCoupons);
router.delete('/delete/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, deleteCoupon);
module.exports = router;
