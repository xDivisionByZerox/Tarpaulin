
const { PermissionError, ConflictError } = require('../utils/error.js');

module.exports.isAuthorizedToCreateCourse = (auth_role) => {
  if (auth_role != 'admin') {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }
}

module.exports.checkForExistingCourse = async (body) => {
  const existingCourse = await Course.findOne(body);
    if (existingCourse) {
      throw new ConflictError('A course with the specified fields already exists.');
    }
}
