const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const validateMongoDB = require('../utils/validateMongoDB');

const createBlog = async (req, res, next) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: 'success',
            newBlog,
            msg: 'Create Blogs successfully',
        });
    } catch (err) {
        res.json({
            status: false,
            msg: 'Create Blog Errors',
        });
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
        const getaBlog = await Blog.findById(id).populate('likes');
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                // Tăng số lượt xem lên 1
                $inc: { numViews: 1 },
            },
            { new: true },
        );
        res.json(getaBlog);
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

// Like the blog
const likeBlog = async (req, res) => {
    const { blogId } = req.body;
    // // Find the blog which you want to be like
    const blog = await Blog.findById(blogId);
    console.log(blog);
    const loginUserid = req?.user?._id;
    const isLiked = blog?.isLiked;
    console.log(isLiked);
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserid?.toString());
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserid },
                isDisliked: false,
            },
            { new: true },
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserid },
                isLiked: false,
            },
            {
                new: true,
            },
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserid },
                isLiked: true,
            },
            {
                new: true,
            },
        );
        res.json(blog);
    }
};

const dislikeBlog = async (req, res) => {
    const { blogId } = req.body;
    // // Find the blog which you want to be like
    const blog = await Blog.findById(blogId);
    console.log(blog);
    const loginUserid = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    console.log(isDisliked);
    const alreadyDisliked = blog?.likes?.find((userId) => userId?.toString() === loginUserid?.toString());
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserid },
                isLiked: false,
            },
            { new: true },
        );
        res.json(blog);
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserid },
                isDisliked: false,
            },
            {
                new: true,
            },
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserid },
                isDisliked: true,
            },
            {
                new: true,
            },
        );
        res.json(blog);
    }
};

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog };
