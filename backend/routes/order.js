const router = require('express').Router()
const Book = require('../models/book')
const Order = require('../models/order')
const User = require('../models/user')
const { authenticateToken } = require('./userAuth')

// Place an order
//user save order id and order save user and book id
router.post('./place-order', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const { order } = req.body
        for (const orderData of order) {
            //create an instance of order schema in db 
            const newOrder = new Order({
                user: id,
                book: orderData._id
            })
            const orderDataFromDb = await newOrder.save()
            // Saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id }
            })
            //Clearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id }
            })
        }
        return res.json({
            status: "Success",
            message: "Order placed successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" })
    }
})

// Get order history for specific user
router.get('./get-order-history', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const userData = await User.findById(id).populate({
            path: 'orders',
            populate: { path: 'book' }
        })
        const ordersData = userData.orders.reverse()
        return res.json({
            status: 'Success',
            data: ordersData
        })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' })
    }
})

// Get all orders --admin
router.get('./get-all-order', authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: 'book',

            })
            .populate({
                path: 'user'
            })
            .sort({ createdAt: -1 })
        return res.json({
            status: 'Success',
            data: userData
        })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' })
    }
})

// Update order --admin
router.get('./update-status/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params
        await Order.findByIdAndUpdate(id, { status: req.body.status })
        return res.json({
            status: 'Success',
            message: 'Status updated successfully'
        })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' })
    }
})
module.exports = router
