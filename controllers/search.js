const { response } = require("express");
const { ObjectId } = require("mongoose").Types
const { User, Category, Product } = require("../models");


const permittedConnections = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUsers = async( term = '', res = response ) => {

    // Validate if exist some in MongoDB
    const isMongoID = ObjectId.isValid( term ) // True

    if ( isMongoID ) {
        const user = await User.findById( term )
        return res.json({
            results: ( user ) ? [ user ] : []
        })
    }

    // Create a regular expression
    // This allows us to get all the results by an common expression
    const regex  = new RegExp( term, 'i' ) 

    // Get the users by name or email
    const users = await User.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    }) 

    res.json({
        results: users
    })
}

const searchCategories = async( term = '', res = response ) => {

    // Validate if exist some in MongoDB
    const isMongoID = ObjectId.isValid( term ) // True

    if ( isMongoID ) {
        const category = await Category.findById( term )
        return res.json({
            results: ( category ) ? [ category ] : []
        })
    }

    // Create a regular expression
    // This allows us to get all the results by an common expression
    const regex  = new RegExp( term, 'i' ) 

    // Get the users by name or email
    const categories = await Category.find({ name: regex, state: true }) 

    res.json({
        results: categories
    })
}

const searchProducts = async( term = '', res = response ) => {

    // Validate if exist some in MongoDB
    const isMongoID = ObjectId.isValid( term ) // True

    if ( isMongoID ) {
        const prodcuct = await Product.findById( term ).populate("category", "name")
        return res.json({
            results: ( prodcuct ) ? [ prodcuct ] : []
        })
    }

    // Create a regular expression
    // This allows us to get all the results by an common expression
    const regex  = new RegExp( term, 'i' ) 

    // Get the users by name or email
    const prodcucts = await Product.find({ name: regex, state: true })
                            .populate("category", "name")

    res.json({
        results: prodcucts
    })
}


const search = ( req, res = response ) => {

    const { collection, term } = req.params

    if ( !permittedConnections.includes( collection ) ) {
        return res.status({
            msg: `Pemitted connection are: ${ permittedConnections }`
        })
    }

    switch ( collection ) {
        case 'users':
            searchUsers( term, res )
        break

        case 'categories':
            searchCategories( term, res )
        break

        case 'products':
            searchProducts( term, res )
        break

        default:
            res.status(500).json({
                msg: "Forget to do this search"
            })
    }

}

module.exports = {
    search
}