const { response } = require("express");


const isAdminRole = ( req, res = response, next ) => {

    // verify if exist a user authenticated
    if ( !req.user) {
        return res.status(500).json({
            msg: "It requires to validate the token first"
        })
    }

    // Desestruct the role and name
    const { role, name } = req.user

    // verify if the role is correct
    if ( role !== "ADMIN_ROLE" ) {
        return res.status(401).json({
            msg: `${ name } not an administrator - Cannot access`
        })
    }


    next()
}

const hasRole = ( ...roles ) => {
    
    return ( req, res = response, next ) => {
        // verify if exist a user authenticated
        if ( !req.user ) {
            return res.status(500).json({
                msg: "It requires to validate the token first"
            })
        }
        
        // Verify if the role is correct
        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: `service requires one of these roles ${ roles }`
            })
        }

        next()
    }

}

module.exports = {
    isAdminRole,
    hasRole
}