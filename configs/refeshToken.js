const jwt = require('jsonwebtoken');
const refeshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};
module.exports = { refeshToken };
