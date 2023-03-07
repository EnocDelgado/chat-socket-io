const { Router } = require('express');
const { check } = require('express-validator');
const { getUser, postUser, putUser, deleteUser, patchUser } = require('../controllers/users');
const { isValidRole, isValidEmail, isValidID } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole, hasRole } = require('../middlewares/validates-roles');

const router = Router();

router.get('/', getUser );


router.put('/:id', [
    validateJWT,
    check("id", "Invalid id").isMongoId(),
    check("id").custom( isValidID ),
    check("role").custom( isValidRole ),
    validateFields
], putUser );

router.post('/', [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is invalid").isEmail(),
    check("email").custom( isValidEmail ),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
    // check("role", "Invalid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // check("role").custom( isValidRole ),
    validateFields
], postUser );

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "Invalid id").isMongoId(),
    check("id").custom( isValidID ),
    validateFields
], deleteUser );
    
router.patch('/', patchUser );

module.exports = router;