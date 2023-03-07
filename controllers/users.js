const { response } = require('express')
const User = require('../models/user') // User is capitalized to create an instance
const bcrypt = require('bcrypt')


const getUser =  async( req, res = response ) => {
    
    // pagination is to asign specifics attributes to show in our response
    const { limit = 5, from = 0 } = req.query
    const query = { state: true }
    
    // We use Promise casue is more efficient and fast
    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
           .skip( Number( from ) )
           .limit( Number( limit ) )
    ])

    res.json({
        total,
        users
    })
}


const postUser =  async( req, res = response ) => {

    // This is to read the body of the request
    const { name, email, password, role } = req.body
    const user = new User({ name, email, password, role })

    // Encrypt the password
    const salt = bcrypt.genSaltSync() // Salt is numbers of shifts for encryption
    user.password = bcrypt.hashSync( password, salt )

    // user save is to save in MongoDB
    await user.save()

    res.json({
        user
    })
}


const putUser =  async( req, res = response ) => {

    const { id } = req.params
    const { _id, password, google, email, ...rest } = req.body

    // TODO: validate against the database
    if ( password ) {
        // Encrypt the  password
        const salt = bcrypt.genSaltSync()
        rest.password = bcrypt.hashSync( password, salt )
    }
    const user = await User.findByIdAndUpdate( id, rest )

    res.json( user )
}


const patchUser =( req, res = response ) => {
    res.json({
        msg: "patch API - Controller"
    })
}


const deleteUser =  async( req, res = response ) => {

    const { id } = req.params
    // we really erased it
    const user = await User.findByIdAndUpdate( id, { state: false } )

    res.json( user )
}


module.exports = { 
    getUser,
    postUser,
    putUser,
    deleteUser,
    patchUser
}