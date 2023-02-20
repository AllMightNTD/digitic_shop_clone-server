const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Schema.Types;
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        cart: {
            type: Array,
            default: [],
        },
        address: [{ type: ObjectId, ref: 'Address' }],
        wishlist: [{ type: ObjectId, ref: 'Product' }],
        refeshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);
userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);
