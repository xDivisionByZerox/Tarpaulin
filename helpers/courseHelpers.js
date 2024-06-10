const { PermissionError, ConflictError, ServerError, ValidationError } = require('../utils/error.js');
const { Course } = require('../models/course.js');

module.exports.isAdmin = (auth_role) => {
  if (auth_role != 'admin') {
    throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
  }
}

module.exports.checkForExistingCourse = async (body) => {
  try {
    const existingCourse = await Course.findOne(body);
    if (existingCourse) {
      console.log('Course already exists.');
      throw new ConflictError('A course with the specified fields already exists.');
    }
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }
    throw new ValidationError('The request body was either not present or did not contain all the required fields.');
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

module.exports.generatePaginatedCourseLinks = (pageNumber, lastPage) => {
  const links = {};
  if (pageNumber < lastPage) {
    links.nextPage = `/courses?page=${pageNumber + 1}`;
    links.lastPage = `/courses?page=${lastPage}`;
  }
  if (pageNumber > 1) {
    links.prevPage = `/courses?page=${pageNumber - 1}`;
    links.firstPage = '/courses?page=1';
  }
  return links;
}

module.exports.mapCourses = (courses) => {
  return courses.map((course) => {
    return {
      id: course._id,
      title: course.title,
      subject: course.subject,
      number: course.number,
      term: course.term,
      instructorId: course.instructorId,
      links: {
        self: `/courses/${course._id}`
      }
    };
  });
}

module.exports.calculatePagination = (page, numPerPage, totalItems) => {
  const coursePage = parseInt(page) || 1;
  const lastPage = Math.ceil(totalItems / numPerPage);
  const pageNumber = Math.min(Math.max(coursePage, 1), lastPage);
  const skip = (pageNumber - 1) * numPerPage;
  
  return { pageNumber, skip, lastPage };
};


module.exports.handleCourseError = async (error) => {
  console.error('Course Error: ', error);
  if (!(error instanceof ServerError)) {
    return new ServerError('An unexpected error occurred.');
  }
  return error;
}

