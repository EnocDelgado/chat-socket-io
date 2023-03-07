const { Router } = require('express')
const { check } = require('express-validator')
const { login, googleSignIn, renewToken } = require('../controllers/auth')
const { validateFields } = require('../middlewares/validate-fields')
const { validateJWT } = require('../middlewares/validate-jwt')

const router = Router()

router.post('/login', [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields
], login)

router.post('/google', [
    check("id_token", "id_token is required").not().isEmpty(),
    validateFields
], googleSignIn )

router.get('/', validateJWT, renewToken )

module.exports = router