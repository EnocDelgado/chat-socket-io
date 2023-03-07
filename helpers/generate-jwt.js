const jwt = require("jsonwebtoken")
const { User } = require('../models/user')

const generateJWT = ( uid = "" ) => {

    return new Promise(( resolve, reject ) => {
        const payload = { uid }

        jwt.sign( payload, process.env.SECRETPRIVATE_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log( err )
                reject( "Could not generate JWT token")
            } else {
                resolve( token )
            }
        })
    })
}


const checkJWT = async( token = '' ) => {

    try {
        // Verify if token is getting
        if ( token.length < 10 ) {
            return null
        }

        // Verify uid
        const { uid } = jwt.verify( token, process.env.SECRETPRIVATE_KEY )
        const user = await User.findById( uid )

        // Verify user uid and state
        if ( user ) {
            if ( user.state ){
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch ( error ) {
        return null;
    }
}

module.exports = {
    generateJWT,
    checkJWT
}