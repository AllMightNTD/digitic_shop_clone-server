const mongoose = require('mongoose');
const dotenv = require('dotenv');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shop_clone', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect succesfully');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { connect };
