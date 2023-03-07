const mongoose = require('mongoose')

const dbConnnection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_CNN )
        console.log('Connected to database')

    } catch (err) {
        // This console.log is to see the error
        console.log( err )
        throw new Error("Error Establishing a Database Connection")
    }
}

module.exports = { 
    dbConnnection
}