const expressAsyncHandler = require('express-async-handler');
const { generateToken } = require('../configs/jwtToken');
const User = require('../models/userModel');
const validateMongoDB = require('../utils/validateMongoDB');

// Register User
const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        res.json({
            msg: 'Ton tai user',
            success: false,
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Check if user exists or not
    const findUser = await User.findOne({ email: email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        res.json({
            msg: 'Email or Password not valid',
            success: 'false',
        });
    }
};

// Update a user
const updateaUser = async (req, res) => {
    const { _id } = req.user;
    validateMongoDB(_id);
    console.log(_id);
    try {
        const updateaUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body.firstname,
                lastname: req?.body.lastname,
                email: req?.body.email,
                mobile: req?.body.mobile,
            },
            {
                new: true,
            },
        );
        res.json({ updateaUser });
    } catch (error) {
        throw new Error(error);
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const getAllUser = await User.find();
        res.json(getAllUser);
    } catch (error) {
        res.json({
            msg: error,
            success: 'false',
        });
    }
};

// Get a single user
const getaUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
};

// Delete a single user
const deleteaUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
};

// block User
const blockUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            },
        );
        res.json({
            msg: 'User blocked',
            blockUser,
        });
    } catch (error) {
        throw new Error(error);
    }
};
const unblockUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            {
                new: true,
            },
        );
        res.json({ msg: 'User unblocked', unblockUser });
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { createUser, loginUser, getAllUsers, getaUser, deleteaUser, updateaUser, blockUser, unblockUser };
