const validateFields = require('../middlewares/validate-fields')
const validateJWT = require('../middlewares/validate-jwt')
const validateRoles = require('../middlewares/validates-roles')
const validateFile = require('../middlewares/validate-file');

module.exports = {
  validateFields,
  validateJWT,
  validateRoles,
  validateFile
}