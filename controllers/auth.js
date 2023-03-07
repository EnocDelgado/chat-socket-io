const { response } = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const { generateJWT } = require("../helpers/generate-jwt")
const { googleVerify } = require("../helpers/google-verify")

const login = async( req, res = response ) => {

    const { email, password } = req.body

    try {
        // Verify if email exists
        const user = await User.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                msg: "User / Password not found - email"
            })
        }

        // If user is active
        if ( !user.state ) {
            return res.status(400).json({
                msg: "User / Password not found - database"
            })
        }

        // Verify password
        // CompareSync is a funtion that verify if the password is equal to user password
        const validatePassword = bcrypt.compareSync( password, user.password )
        if ( !validatePassword ) {
            return res.status(400).json({
                msg: "User / Password not found - password"
            })
        }
        // Generate jwt token
        const token = await generateJWT( user.id )

        res.json({
            user,
            token
        })

    } catch ( err ) {
        console.error( err )
        res.status(500).json({
            message: "Talk with admin"
        })
    }
}

const googleSignIn = async( req, res = response) => {

    const { id_token } = req.body

    try {
        const { email, name, picture } = await googleVerify( id_token )

        // Verify if user not exist
        let user = await User.findOne({ email })

        if ( !user ) {
            // Have to create it
            const data = {
                name,
                email,
                password,
                picture,
                role: "USER_ROLE",
                google: true
            }

            user = new User( data )
            await user.save()
        }

        // Verify if user has false status
        if (!user.state ) {
            return res.status(400).json({
                msg: "Talk to the administrator, user with blocked access"
            })
        }

        // Generate jwt token
        const token = await generateJWT( user.id )
        
        res.json({
            user,
            token
        })
    } catch ( err ) {
        res.status( 400 ).json({
            ok: false,
            msg: "Token not verified"
        })
    }

}

const renewToken = async( req, res = response ) => {

    const { user } = req

    // Generate jwt token
    const token = await generateJWT( user.id )

    res.json({
        user,
        token
    })
}

module.exports = { 
    login,
    googleSignIn,
    renewToken
}