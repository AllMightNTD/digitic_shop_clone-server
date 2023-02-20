const expressAsyncHandler = require('express-async-handler');
const { generateToken } = require('../configs/jwtToken');
const User = require('../models/userModel');
const validateMongoDB = require('../utils/validateMongoDB');
const refeshToken = require('../configs/refeshToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const memoryCache = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dung1512665@nuce.edu.vn',
        pass: 'mpsdnzgffcewmgrm',
    },
});

// forgotPass
const forgotPass = async (req, res, next) => {
    const email = req.body;
    console.log(email.email);
    // Tạo token xác minh
    const token = await crypto.randomBytes(3).toString('hex');
    memoryCache[email.email] = token;

    const mailOptions = {
        from: 'dungnguyentien140602@gmail.com',
        to: email.email,
        subject: 'Mã xác minh để đặt lại mật khẩu của bạn',
        html: `<p>Vui lòng sử dụng mã xác minh sau để đặt lại mật khẩu:</p><p><strong>${token}</strong></p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Gửi email lỗi', status: false });
        } else {
            console.log('Email sent' + info.response);
            res.status(200).json({
                msg: 'Mã xác minh đã được gửi đến email của bạn',
                status: 'success',
            });
        }
    });
};

// ResetPass
const resetPass = async (req, res) => {
    console.log(memoryCache);
    const { email, verificationcode, newPassword } = req.body;
    // Check if user exists or not
    if (verificationcode === memoryCache[email]) {
        console.log(`Mật khẩu mới là ${newPassword}`);
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        User.findOneAndUpdate({ email: email }, { password: hashedPassword })
            .then(() => {
                delete memoryCache[email];
                res.status(200).json({ msg: 'Mật khẩu của bạn đã được đặt lại', status: 'success' });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Có lỗi xảy ra khi đặt mật khẩu mới', status: false });
            });
    } else {
        res.json({
            status: false,
            msg: 'Mã xác minh không đúng , vui lòng nhập lại',
        });
    }
};

// Register User
const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const user = await User.create(req.body);
        res.json({
            status: 'success',
            user,
        });
    } else {
        res.json({
            msg: 'Ton tai user vui long login',
            status: false,
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Check if user exists or not
    const user = await User.findOne({ email: email });
    if (user && (await user.isPasswordMatched(password))) {
        const refeshToken = await generateToken(user?._id);
        const updateToken = await User.findByIdAndUpdate(
            user.id,
            {
                refeshToken: refeshToken,
            },
            {
                new: true,
            },
        );
        res.cookie('refeshToken', refeshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 72 * 1000,
        });
        res.json({
            status: 'success',
            // _id: findUser?._id,
            // firstname: findUser?.firstname,
            // lastname: findUser?.lastname,
            // email: findUser?.email,
            // mobile: findUser?.mobile,
            user,
            token: generateToken(user?._id),
        });
    } else {
        res.json({
            msg: 'Email or Password not valid',
            status: 'false',
        });
    }
};

// Handle Refesh Token
const handleRefeshToken = async (req, res) => {
    // Lấy mã thông báo từ cookie
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.refeshToken) throw new Error('No research Token in Cookies');
    const refeshToken = cookies.refeshToken;
    console.log(refeshToken);

    // Tìm kiếm người dùng có mã refeshtoken lấy được
    const user = await User.findOne({ refeshToken });
    if (!user) throw new Error('No refesh TOken present in db or not matched');

    // Xác minh người dùng
    jwt.verify(refeshToken, process.env.JWT_SECRET, (err, decode) => {
        console.log(decode);
        if (err || user.id !== decode.id) {
            throw new Error('There is something wrong with refesh token');
        }

        // Tạo token mới sau khi xác minh thành công
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
};

// Log Out
const logoutUser = async (req, res) => {
    // Lấy mã thông báo từ cookie
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.refeshToken) throw new Error('No research Token in Cookies');
    const refeshToken = cookies.refeshToken;
    const user = await User.findOne({ refeshToken });
    if (!user) {
        res.clearCookie('refeshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.status(204);
    }
    await User.findOneAndUpdate(refeshToken, {
        refeshToken: '',
    });
    res.clearCookie('refeshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
    res.send('Log out thành công ');
};

// Update a user
const updateaUser = async (req, res) => {
    const { _id } = req.user;
    validateMongoDB(_id);
    console.log(_id);
    try {
        const user = await User.findByIdAndUpdate(
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
        res.json({
            status: 'success',
            user,
        });
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
            status: 'false',
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

// forgot-password and send code

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefeshToken,
    logoutUser,
    forgotPass,
    resetPass,
};
