const Role = require('../models/role')
const { User, Category, Product} = require('../models')

// Verify if the ROLE is valid
const isValidRole = async(role = "") => {
    const roleExists = await Role.findOne({ role })
    if ( !roleExists ) {
        throw new Error(`Role: ${ role } does not exist in database`)
    }
}


// Verify if the email is valid
const isValidEmail = async( email = "" ) => {
    const emailExists = await User.findOne({ email })
    if ( emailExists ) {
        throw new Error(`Email: ${ email } already exists`)
    }
}


// Verify if the email is valid
const isValidID = async( id ) => {
    const existsID = await User.findById( id )
    if ( !existsID ) {
        throw new Error(`ID: ${ id } does not exist`)
    }
}


// Verify if the categoory id is valid
const existCategoryId = async( id ) => {
    const existsCategory = await Category.findById( id )
    if ( !existsCategory ) {
        throw new Error(`ID: ${ id } does not exist`)
    }
}

// Verify if exists product
const existProductId = async( id ) => {
    const existsProduct = await Product.findById( id )
    if ( !existsProduct ) {
        throw new Error(`ID: ${ id } does not exist`)
    }
}

// Validate permitted collections
const permittedCollections = ( collection = '', collections = [] ) => {

    const include = collection.includes( collection );
    if ( !include ) {
        throw new Eroor(`Collection ${ collection } does not permitted, ${ collections }`)
    }
    return true;
}


module.exports = {
    isValidRole,
    isValidEmail,
    isValidID,
    existCategoryId,
    existProductId,
    permittedCollections
}