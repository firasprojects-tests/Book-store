const express = require('express')
const app = express()
require('dotenv').config()
require('./conn/conn') //this after dotenv always required

const User = require('./routes/user-routes')
const Books = require('./routes/book')
const Favorite = require('./routes/favorite')
const Cart = require('./routes/cart')
const Order = require('./routes/order')
app.use(express.json())

//routes
app.use('/api/v1', User)
app.use('/api/v1', Books)
app.use('/api/v1', Favorite)
app.use('/api/v1', Cart)
app.use('/api/v1', Order)

// creating port
app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`)
})

// {
//     "username": "omar",
//     "password": "abcdef"
//   }

// {
//     "username": "firas",
//     "password": "123456"
//   }

// {
//     "username": "ahmad",
//     "password": "hello123"
//   }


