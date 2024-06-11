const { PermissionError, ConflictError, ServerError, ValidationError } = require('../utils/error.js');
const { Assignment } = require('../models/assignment.js');
const { Submission } = require('../models/submission.js');
const { User } = require('../models/user.js');
const { Course } = require('../models/course.js');


module.exports.isCourseInstructor = (auth_role, user_id, course_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (auth_role == 'admin') {
        return resolve();
      }
      const course = await Course.findById(course_id);
      if (!course) {
        throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
      }
      if (course.instructorId != user_id) {
        throw new PermissionError('The request was not made by an authenticated User satisfying the authorization criteria.');
      }
      return resolve();
    } catch (error) {
      return reject(await this.handleCourseError(error));
    }
  })
}

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

module.exports.generatePaginatedSubmissionLinks = (pageNumber, lastPage, assignment_id, student_id) => {
  const links = {};
  if (pageNumber < lastPage) {
    links.nextPage = `/assignments/${assignment_id}/submissions/?page=${pageNumber + 1}&studentId=${student_id}`;
    links.lastPage = `/assignments/${assignment_id}/submissions/?page=${lastPage}&studentId=${student_id}`;
  }
  if (pageNumber > 1) {
    links.prevPage = `/assignments/${assignment_id}/submissions/?page=${pageNumber - 1}&studentId=${student_id}`;
    links.firstPage = `/assignments/${assignment_id}/submissions/?page=1&studentId=${student_id}`;
  }
  return links;
}

module.exports.calculatePagination = (page, numPerPage, totalItems) => {
  const coursePage = parseInt(page) || 1;
  const lastPage = Math.ceil(totalItems / numPerPage);
  const pageNumber = Math.min(Math.max(coursePage, 1), lastPage);
  const skip = (pageNumber - 1) * numPerPage;
  
  return { pageNumber, skip, lastPage };
};
  
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

// module.exports.checkForExistingSubmission = async (body) => {
//     try {
//       const existingSubmission = await Assignment.findOne(body);
//       if (existingSubmission) {
//         console.log('Submission already exists.');
//         throw new ConflictError('A Submission with the specified fields already exists.');
//       }
//     } catch (error) {
//       if (error instanceof ConflictError) {
//         throw error;
//       }
//       throw new ValidationError('The request body was either not present or did not contain all the required fields.');
//     }
//   }

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
  console.log("REACHING CREATE ASSIGNMENT HELPER")
  const createdAssignment = await Assignment.create(assignmentFields);
  const response = {
    id: createdAssignment._id,
    links: {
      course: `/assignments/${createdAssignment._id}`
    }
  };
  return response;
}

module.exports.createSubmission = async (submissionFields, assignmentId) => {
    //create new submission and add it to assignment's submission list
    const existingAssignment = await Assignment.findOne(assignmentId);
    if (!existingAssignment) {
        throw new NotFoundError('Assignment not found.');
      }
      
    const createdSubmission = await Submission.create(submissionFields);
    await Assignment.updateOne({ _id: assignmentId }, { $addToSet: {submissions: createdSubmission } });
    const response = {
      id: createdSubmission._id,
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

