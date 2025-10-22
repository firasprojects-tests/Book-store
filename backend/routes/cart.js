const router = require('express').Router()
const User = require('../models/user')
const { authenticateToken } = require('./userAuth')

// Add book to cart 
router.post('/add-book-to-cart', authenticateToken, async (req, res) => {
    try {
        const { id, bookid } = req.headers
        const userData = await User.findById(id)
        const isBookInCart = userData.cart.includes(bookid)
        if (isBookInCart) {
            return res.json({
                status: "Success",
                message: "Book already in cart"
            })
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } })
        return res.json({
            status: "Success",
            message: "Book added to cart"
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" })
    }
})
// Delete book from cart
router.delete('/delete-book-from-cart/:bookid', authenticateToken, async (req, res) => {
    try {
        /* 
        const { id, bookid } = req.headers
        const userData = await User.findById(id)
        const isBookInCart = userData.cart.includes(bookid)
        if (isBookInCart) {
            await User.findByIdAndUpdate(id, { $pull: { cart: bookid } })
        }
        */
        //or 
        const { id } = req.headers
        const { bookid } = req.params
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } })
        return res.status(200).json({ message: "Book removed from cart" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " })
    }
})

// Get cart of a specific user
router.get('/get-user-cart', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const userData = await User.findById(id).populate("cart")
        const cart = userData.cart.reverse()
        return res.json({
            status: "Success",
            data: cart
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" })
    }
})
module.exports = router