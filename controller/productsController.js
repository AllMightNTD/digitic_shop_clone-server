const Product = require('../models/productModel');
const slugify = require('slugify');
const createProduct = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        console.log(req.body);
        res.json({
            status: 'success',
            msg: 'Create new Product Success',
            newProduct,
        });
    } catch (error) {
        res.json({
            status: false,
            msg: 'Tạo lỗi',
        });
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
    try {
        // Filter
        const queryObj = { ...req.query };

        // Mảng chuỗi các trường bị loại bỏ khỏi query
        const excludeFields = ['page', 'sort', 'limit', 'fileds'];

        // Loại bỏ các trường
        excludeFields.forEach((el) => delete queryObj[el]);

        // Chuyển đổi đối tượng queryObj thành chuỗi JSON và thay thế các chuỗi phép tìm kiếm (ví dụ: 'gte', 'in', vv.) bằng các phép toán tương đương của MongoDB (ví dụ: '$gte', '$in', vv.) bằng cách sử dụng biểu thức chính quy và phương thức replace().

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

        // Tạo một đối tượng truy vấn mới của Mongoose bằng cách sử dụng phương thức find() và queryObj đã được phân tích.
        let query = Product.find(JSON.parse(queryString));

        // Sort
        if (req.query.sort) {
            // Loại bỏ dấu phẩy
            const sortBy = req.query.sort.split(',').join(' ');
            // Sắp xếp theo query truyền vào
            query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Limitting the fields
        // Giới hạn các trường
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query.select(fields);
        } else {
            query.select('-__v');
        }

        // Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = limit * (page - 1);
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = Product.countDocuments();
            if (skip >= productCount) {
                throw new Error('Invalid pagination');
            }
        }

        const allProducts = await query;
        res.json(allProducts);
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
