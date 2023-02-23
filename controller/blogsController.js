const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const validateMongoDB = require('../utils/validateMongoDB');

const createBlog = async (req, res, next) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: 'success',
            newBlog,
        });
    } catch (err) {
        throw new Error(err);
    }
};

const updateBlog = async (req, res, next) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);
    } catch (err) {
        throw new Error(err);
    }
};

const getBlog = async (req, res, next) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const getaBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                // Tăng số lượt xem lên 1
                $inc: { numViews: 1 },
            },
            { new: true },
        );
        res.json(updateViews);
    } catch (err) {
        throw new Error(err);
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find();
        res.json(allBlogs);
    } catch (error) {
        throw new Error(error);
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        validateMongoDB(id);
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json({
            status: 'success',
            deleteBlog,
        });
    } catch (error) {
        res.json({
            status: false,
            msg: 'Delete not in valid',
        });
    }
};

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog };
