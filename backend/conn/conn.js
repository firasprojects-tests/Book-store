const mongoose = require('mongoose')

const conn = async () => {
    try {
        // enter url to create a connection
        await mongoose.connect(`${process.env.URI}`)
        console.log('connected to database')
    } catch (error) {
        console.log(error)
    }
}

// running a function 
conn()