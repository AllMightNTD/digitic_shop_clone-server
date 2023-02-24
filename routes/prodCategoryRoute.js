const express = require('express');
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory,
} = require('../controller/prodCategoryCtrl');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();

// Chỉ có admin mới có quyền tạo ,lấy sản phẩm
router.get('/get/:id', getCategory);
router.get('/getAll', authMiddelware.authMiddleware, authMiddelware.isAdmin, getAllCategory);
router.post('/', authMiddelware.authMiddleware, authMiddelware.isAdmin, createCategory);
router.put('/update/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;
