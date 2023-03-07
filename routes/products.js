const { Router } = require('express');
const { check } = require('express-validator');
const { CreateProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existProductId, existCategoryId } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validates-roles');

const router = Router();

/**
 *  https://localhost:port/prodcucts
 */

// Obteain all categories - public
router.get('/', getProducts);

// Obteain a category by id - public
router.get('/:id', [
    check('id', 'It is not a MongoDB id valid').isMongoId(),
    check('id').custom( existProductId ),
    validateFields,
], getProduct);

// Create category - private - any user with a valid token
router.post('/', [ 
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check("category", "It is not a MongoDB id valid").isMongoId(),
    check('category').custom( existCategoryId ),
    validateFields
], CreateProduct);

// Update - private - any user with a valid token
router.put('/:id', [
    validateJWT,
    // check("category", "It is not a MongoDB id valid").isMongoId(),
    check('id').custom( existProductId ),
    validateFields,
], updateProduct);

// Delete a category - private - ADMIN_ROLE
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'It is not a MongoDB id valid').isMongoId(),
    check('id').custom( existProductId ),
    validateFields,
], deleteProduct );

module.exports = router;