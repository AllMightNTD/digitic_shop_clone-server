const mongoose = require('mongoose');
const validateMongoDB = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('This is invalid or not Found');
};
module.exports = validateMongoDB;
