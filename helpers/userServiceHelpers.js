const { ValidationError, PermissionError, ConflictError, ServerError} = require('../utils/error.js');
const { User } = require('../models/user.js');
const { extractValidFields } = require('../utils/validation.js');
const bcrypt = require('bcrypt');


module.exports.checkLoginFields = async function(body) {
  if (!body.email || !body.password) {
    throw new ValidationError('The request body was either not present or did not contain all the required fields.');
  }
}

module.exports.isAuthorizedToCreateUser = async function(role, auth_role) {
  if (typeof(role) != 'string' || typeof(auth_role) != 'string') {
    throw new ValidationError('The request body was either not present or did not contain a valid User object.');
  }
}

module.exports.checkForExistingUser = async function(body) {
  const existingUser = await User.findOne({where: {email: body.email}});
  if (existingUser) {
    throw new ConflictError('User already exists.');
  }
  return existingUser;
}

module.exports.hashAndExtractUserFields = async function(body) {
  const passwordHash = await bcrypt.hash(body.password, 8);
  body.password = passwordHash;

  const userFields = extractValidFields(body, User);
  return userFields;
}

module.exports.createUser = async function(userFields) {
  const createdUser = await User.create(userFields);

  const response = {
    id: createdUser._id,
    links: {
      user: `/users/${createdUser._id}`
    }
  };

  return response;
}

module.exports.handleUserError = async function(error) {
  if (!(error instanceof ServerError)) {
    return new ServerError('An error occurred while creating a new User.');
  }
  return error;
}
