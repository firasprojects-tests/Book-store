const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('./userAuth') //import

// Signup
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body

        // check username length is more than 3
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: 'Username length should be greater than 3' })
        }

        //check username already exist ?
        const existingUsername = await User.findOne({ username: username })
        if (existingUsername) {
            return res
                .status(400)
                .json({ message: 'Username already exists' })
        }

        //check email already exist ?
        const existingEmail = await User.findOne({ email: email })
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: 'Email already exists' })
        }

        //check password's length 
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password's length should be greater than 5" })
        }
        const hashPass = await bcrypt.hash(password, 10)

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        })
        await newUser.save()
        return res.
            status(200).
            json({ message: 'Signup successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Sign in
router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body

        const existingUser = await User.findOne({ username })
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials, User Not Found' })
        }

        const match = await bcrypt.compare(password, existingUser.password)
        if (match) {
            // payloads
            const authClaims = [
                { name: existingUser.username },
                { role: existingUser.role }
            ]
            // create a token and signature using it secretkey and payloads
            const token = jwt.sign({ authClaims }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" })
            return res
                .status(200)
                .json({
                    id: existingUser._id,
                    role: existingUser.role,
                    token: token
                })
        } else {
            return res.status(400).json({ message: 'Invalid credentials, Wrong Password' })
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// get-user-information
router.get('/get-user-information', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const data = await User.findById(id).select('-password')
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
})

//update address
router.put('/update-address', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers
        const { address } = req.body
        await User.findByIdAndUpdate(id, { address: address })
        return res.status(200).json({ message: "Address updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router