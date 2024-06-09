const { ValidationError, PermissionError, ConflictError, ServerError} = require('../utils/error.js');
const { User } = require('../models/user.js');
const { extractValidFields } = require('../utils/validation.js');
const bcrypt = require('bcrypt');


module.exports.isAuthorizedToCreateUser = function(role, auth_role) {
  if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
    throw new ValidationError('The request body was either not present or did not contain a valid User object.');
  }
}

module.exports.isNoExistingUser = async function(body) {
  const existingUser = await User.findOne({where: {email: body.email}});
  if (existingUser) {
    throw new ConflictError('User already exists.');
  }
}

module.exports.hashAndExtractUserFields = async function(body) {
  const passwordHash = await bcrypt.hash(body.password, 8);
  body.password = passwordHash;

  const userFields = extractValidFields(body, User);
  return userFields;
}

