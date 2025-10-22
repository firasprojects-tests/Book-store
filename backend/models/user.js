const mongoose = require('mongoose')

// create schema for user
const user = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '',// img here 
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        favorites: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'books', // reference to books model
            }
        ],
        cart: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'books',
            },
        ],
        orders: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'order',
            },
        ],
    },
    { timestamps: true }
)

module.exports = mongoose.model('user', user)
















