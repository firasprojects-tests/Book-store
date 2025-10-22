const router = require('express').Router()
const User = require('../models/user')
const { authenticateToken } = require('./userAuth')

// Add book to favorite
router.post('/add-book-to-favorite', authenticateToken, async (req, res) => {
    try {
        const { id, bookid } = req.headers
        const userData = await User.findById(id)
        const isBookFavorite = userData.favorites.includes(bookid)
        if (isBookFavorite) {
            return res.status(400).json({ message: "Book already in favorites" })
        }
        await User.findByIdAndUpdate(id, { $push: { favorites: bookid } })
        return res.status(200).json({ message: "Book added to favorites" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " })
    }
})

// Delete book from favorite
router.delete('/delete-book-from-favorite', authenticateToken, async (req, res) => {
    try {
        const { id, bookid } = req.headers
        const userData = await User.findById(id)
        const isBookFavorite = userData.favorites.includes(bookid)
        if (isBookFavorite) {
            await User.findByIdAndUpdate(id, { $pull: { favorites: bookid } })
        }
        return res.status(200).json({ message: "Book removed from favorites" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " })
    }
})

// Get favorite book for specific user
router.get('/get-favorite-books', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const userData = await User.findById(id).select("-password").populate("favorites") // fetch full favorite document and merged it
        const favoriteBooks = userData.favorites
        return res.json({
            status: "Success",
            data: favoriteBooks
        })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" })
    }
})
module.exports = router