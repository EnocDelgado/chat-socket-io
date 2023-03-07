const { Router } = require('express')
const { check } = require('express-validator')
const { uploadfile, updateImage, displayImage, updateImageCloudinary } = require('../controllers/uploads');
const { validateFields } = require('../middlewares/validate-fields');
const { permittedCollections } = require('../helpers/db-validators');
const { validateFile } = require('../middlewares/validate-file');


const router = Router()

router.post('/', validateFile, uploadfile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'Id should be provided by MongoDB').isMongoId(),
    check('collection').custom( c => permittedCollections( c, ['users', 'products'] ) ),
    validateFields
], updateImageCloudinary)

router.get('/:collection/:id', [
    check('id', 'Id should be provided by MongoDB').isMongoId(),
    check('collection').custom( c => permittedCollections( c, ['users', 'products'] ) ),
    validateFields
], displayImage)

module.exports = router