const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                console.log(user);
                next();
            }
        } catch (error) {
            throw new Error('Not Authorization token expired , Please login again');
        }
    } else {
        throw new Error('There is no token');
    }
}
async function isAdmin(req, res, next) {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== 'admin') {
        res.json({
            status: false,
            msg: 'You are not admin',
        });
    } else {
        next();
    }
}
module.exports = { authMiddleware, isAdmin };
