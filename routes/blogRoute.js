const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog } = require('../controller/blogsController');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();

// Chỉ có admin mới có quyền tạo ,lấy sản phẩm
router.post('/', authMiddelware.authMiddleware, authMiddelware.isAdmin, createBlog);
router.put('/update/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, updateBlog);
router.get('/get/:id', getBlog);
router.get('/getAll', getAllBlogs);
router.delete('/delete/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, deleteBlog);
module.exports = router;
