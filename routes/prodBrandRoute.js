const express = require('express');
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require('../controller/prodBrandCtrl');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();

// Chỉ có admin mới có quyền tạo ,lấy sản phẩm
router.get('/get/:id', getBrand);
router.get('/getAll', authMiddelware.authMiddleware, authMiddelware.isAdmin, getAllBrand);
router.post('/', authMiddelware.authMiddleware, authMiddelware.isAdmin, createBrand);
router.put('/update/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, updateBrand);
router.delete('/delete/:id', deleteBrand);

module.exports = router;
