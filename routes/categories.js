const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { existCategoryId } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validates-roles');

const router = Router();

/**
 *  https://localhost:port/categories
 */

// Obteain all categories - public
router.get('/', getCategories);

// Obteain a category by id - public
router.get('/:id', [
    check('id', 'It is not a MongoDB id valid').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields,
], getCategory);

// Cteate category - private - any user with a valid token
router.post('/', [ 
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createCategory);

// Update - private - any user with a valid token
router.put('/:id', [
    validateJWT,
    check("name", 'Name is required').not().isEmpty(),
    check('id').custom( existCategoryId ),
    validateFields,
], updateCategory);

// Delete a category - private - ADMIN_ROLE
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'It is not a MongoDB id valid').isMongoId(),
    // validateFields,
    check('id').custom( existCategoryId ),
    validateFields,
], deleteCategory );

module.exports = router;