const express = require('express');
const {
    createProduct,
    getAproduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require('../controller/productsController');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();

// Chỉ có admin mới có quyền tạo ,lấy sản phẩm
router.post('/', authMiddelware.authMiddleware, authMiddelware.isAdmin, createProduct);
router.put('/update/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, updateProduct);
router.post('/delete/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, deleteProduct);
router.get('/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, getAproduct);
router.get('/', getAllProducts);

module.exports = router;
