const { PermissionError, ConflictError, ServerError, ValidationError } = require('../utils/error.js');
const { Assignment } = require('../models/assignment.js');
const { Submission } = require('../models/submission.js');
const { User } = require('../models/user.js');
const { Course } = require('../models/course.js');

module.exports.isAdminAssignment = (auth_role) => {
    if (auth_role != 'admin') {
      throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
    }
}

module.exports.isAssignmentInstructor = (auth_role, user_id, assignment_id) => {
    return new Promise(async (resolve, reject) => {
    try {
      if (auth_role == 'admin') {
        return resolve();
      }

      const assignment = await Assignment.findById(assignment_id);
      if (!assignment) {
        throw new NotFoundError('Assignment not found.');
      }
      const course = await Course.findById(assignment.courseId);
      if (!course) {
        throw new NotFoundError('Course not found.');
      }
      if (course.instructorId != user_id) {
        throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
      }
      return resolve();
    } catch (error) {
      return reject(await this.handleAssignmentError(error));
    }
  })
}

  
module.exports.isInstructorOrAdminAssignment = (auth_role) => {
    if (auth_role != 'admin') {
      throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
    }
}

module.exports.checkForExistingAssignment = async (body) => {
  try {
    const existingAssignment = await Assignment.findOne(body);
    if (existingAssignment) {
      console.log('Assignment already exists.');
      throw new ConflictError('A Assignment with the specified fields already exists.');
    }
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }
    throw new ValidationError('The request body was either not present or did not contain all the required fields.');
  }
}

module.exports.checkForExistingSubmission = async (body) => {
    try {
      const existingSubmission = await Assignment.findOne(body);
      if (existingSubmission) {
        console.log('Submission already exists.');
        throw new ConflictError('A Submission with the specified fields already exists.');
      }
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new ValidationError('The request body was either not present or did not contain all the required fields.');
    }
  }

module.exports.checkIfStudentInCourse = async (userId, assignmentId) => {
    try {
      const assignment = await Assignment.findOne(assignmentId);
      const user = await User.findOne(userId);
      foundCourse = user.courses.find(cor => cor._id === assignment.courseId)
      if (foundCourse != true){
        throw new PermissionError('The request was not made by user in the assignments course');        
      }
      //Include student check here?

    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new ValidationError('The request body was either not present or did not contain all the required fields.');
    }
  }  


module.exports.createAssignment = async (assignmentFields) => {
  const createdAssignment = await Assignment.create(assignmentFields);
  const response = {
    id: createdAssignment._id,
    links: {
      course: `/assignments/${createdAssignment._id}`
    }
  };
  return response;
}

module.exports.createSubmission = async (submissionFields) => {
    const createdSubmission = await Submission.create(submissionFields);
    const response = {
      id: createdAssignment._id,
    };
    return response;
  }

module.exports.getAssignment = async (id) => {
    const existingAssignment = await Assignment.findById(id);
  
    if (!existingAssignment) {
      throw new NotFoundError('Assignment not found.');
    }
  
    return existingAssignment;
  }

module.exports.handleAssignmentError = async (error) => {
  if (!(error instanceof ServerError)) {
    return new ServerError('An unexpected error occurred.');
  }
  return error;
}

