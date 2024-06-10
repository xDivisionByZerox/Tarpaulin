const { PermissionError, ConflictError, ServerError } = require('../utils/error.js');
const { Course } = require('../models/course.js');

module.exports.isAuthorizedToCreateCourse = (auth_role) => {
  if (auth_role != 'admin') {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }
}

module.exports.checkForExistingCourse = async (body) => {
  const existingCourse = await Course.findOne(body);
  if (existingCourse) {
    console.log('Course already exists.');
    throw new ConflictError('A course with the specified fields already exists.');
  }
}

module.exports.createCourse = async (courseFields) => {
  const createdCourse = await Course.create(courseFields);
  const response = {
    id: createdCourse._id,
    links: {
      course: `/courses/${createdCourse._id}`
    }
  };
  return response;
}

module.exports.handleCourseError = async (error) => {
  if (!(error instanceof ServerError)) {
    return new ServerError('An error occurred while creating a new Course.');
  }
  return error;
}

