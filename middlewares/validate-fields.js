const { validationResult } = require('express-validator')

const validateFields = ( req, res, next ) => {

    // Verify if exists an error
    const errors = validationResult( req ) // ValidationResult is an express-validator methods 
    if ( !errors.isEmpty() ) {
        return res.status(400).json( errors )
     }

     next()
}


module.exports = {
    validateFields
}