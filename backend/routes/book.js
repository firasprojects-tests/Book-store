const router = require('express').Router()
const User = require('../models/user')
const Book = require('../models/book')
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('./userAuth')

// Add book --admin role
router.post('/add-book', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const user = await User.findById(id)
        if (user.role !== 'admin') {
            return res
                .status(400)
                .json({ message: "You are not having access to perform admin work." })
        }
        const { url, title, author, price, desc, language } = req.body
        //can change depend on db
        //create an instance of book schema in db 
        const book = new Book({
            url: url,
            title: title,
            author: author,
            price: price,
            desc: desc,
            language: language,
        })
        await book.save()
        return res.status(200).json({ message: "Book added successfully." })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

// Update book
router.put('/update-book', authenticateToken, async (req, res) => {
    try {
        const { url, title, author, price, desc, language } = req.body
        const { bookid } = req.headers
        await Book.findByIdAndUpdate(bookid, {
            url: url,
            title: title,
            author: author,
            price: price,
            desc: desc,
            language: language
        })
        return res.status(200).json({ message: "Book Updated Successfully." })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred." })
    }
})

// Delete book --admin
router.delete('/delete-book', authenticateToken, async (req, res) => {
    try {
        const { id, bookid } = req.headers
        const admin = await User.findById(id)
        if (admin.role !== 'admin') {
            return res
                .status(400)
                .json({ message: "You are not having access to perform admin work." })
        }
        await Book.findByIdAndDelete(bookid)
        return res.status(200).json({ message: "Book Deleted Successfully." })
    } catch (error) {
        return res.status(500).json({ message: "An error occurred." })
    }
})

// Get all books 
router.get('/get-all-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }) //sort newest book first
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        res.status(500).json({ message: "An error occurred" })
    }
})

// Get recently added books limit to 2
router.get('/get-recent-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(2)
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        res.status(500).json({ message: "An error occurred" })
    }
})

// Get book by ID
router.get('/get-book-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const books = await Book.findById(id)
        return res.json({
            status: "Success",
            data: books
        })
    } catch (error) {
        res.status(500).json({ message: "An error occurred" })
    }
})

module.exports = router