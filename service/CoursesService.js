'use strict';

const { Course } = require('../models/course.js');
const { validateAgainstModel, extractValidFields } = require('../utils/validation.js');
const { ValidationError, NotFoundError} = require('../utils/error.js');
const { checkForExistingCourse, createCourse, handleCourseError, calculatePagination, generatePaginatedCourseLinks, mapCourses, getCourseObjectById, getStudentDataByIds, createAndStreamRoster, updateEnrollmentForCourseId } = require('../helpers/courseHelpers.js');

/**
 * Create a new course.
 * Creates a new Course with specified data and adds it to the application's database.  Only an authenticated User with 'admin' role can create a new Course. 
 *
 * body Course A Course object.
 * returns inline_response_201_1
 **/

exports.createCourse = (body) => {
  return new Promise(async (resolve, reject) => {
    try{
      await validateAgainstModel(body, Course);
      await checkForExistingCourse(body);
      const courseFields = extractValidFields(body, Course);
      const response = await createCourse(courseFields);

      return resolve(response);
    }
    catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Fetch the list of all Courses.
 * Returns the list of all Courses.  This list should be paginated.  The Courses returned should not contain the list of students in the Course or the list of Assignments for the Course. 
 *
 * page Integer Page of Courses to fetch.  (optional)
 * subject String Fetch only Courses with the specified subject code.  (optional)
 * number String Fetch only Courses with the specified course number.  (optional)
 * term String Fetch only Courses in the specified academic term.  (optional)
 * returns inline_response_200_1
 **/

exports.getAllCourses = (page, subject, number, term) => {
  //unfinished
  return new Promise(async (resolve, reject) => {
    try {
      const numPerPage = 10;
      const lengthOfCourses = await Course.countDocuments({});

      const { pageNumber, skip, lastPage } = calculatePagination(page, numPerPage, lengthOfCourses);

      const pageCourses = await Course.find({})
        .skip(skip)
        .limit(numPerPage);
    
      const links = generatePaginatedCourseLinks(pageNumber, lastPage);
      const courses = mapCourses(pageCourses);
    
      const response = {
        courses: courses,
        pageNumber: pageNumber,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: lengthOfCourses,
        links: links
      }
      return resolve(response);
    }
    catch (error) {
      return reject(await handleCourseError(error))
    }
  });
}


/**
 * Fetch a list of the Assignments for the Course.
 * Returns a list containing the Assignment IDs of all Assignments for the Course. 
 *
 * id id_4 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns inline_response_200_3
 **/

exports.getAssignmentsByCourseId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const course = await getCourseObjectById(id);
      const assignments = course.assignments;

      const response = {
        courseId: id,
        assignments: assignments
      };

      return resolve(response);

    } catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Fetch data about a specific Course.
 * Returns summary data about the Course, excluding the list of students enrolled in the course and the list of Assignments for the course. 
 *
 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns Course
 **/

exports.getCourseById = (id) => {
  return new Promise(async (resolve, reject) => {
    try{
      const foundCourse = await Course.findById({_id: id})
      if (!foundCourse){
        throw new NotFoundError('Course not found.');
      }
      const response = {
        id: foundCourse._id,
        subject: foundCourse.subject,
        number: foundCourse.number,
        title: foundCourse.title,
        term: foundCourse.term,
        instructorId: foundCourse.instructorId
      };
      return resolve(response)
    }
    catch (error){
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Fetch a CSV file containing list of the students enrolled in the Course.
 * Returns a CSV file containing information about all of the students currently enrolled in the Course, including names, IDs, and email addresses.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can fetch the course roster. 
 *
 * id id_3 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns String
 **/

exports.getRosterByCourseId = (id, res) => {
  return new Promise(async (resolve, reject) => {
    try{
      const course = await getCourseObjectById(id);
      const studentData = await getStudentDataByIds(course.students);

      createAndStreamRoster(res, course, studentData);
    } catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Fetch a list of the students enrolled in the Course.
 * Returns a list containing the User IDs of all students currently enrolled in the Course.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can fetch the list of enrolled students. 
 *
 * id id_2 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * returns inline_response_200_2
 **/

exports.getStudentsByCourseId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {

      const course = await Course.findById(id);
      if (!course){
        throw new NotFoundError('Course not found.');
      }

      const response = {
        courseId: id,
        students: course.students
      };

      return resolve(response);
    }
    catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Remove a specific Course from the database.
 * Completely removes the data for the specified Course, including all enrolled students, all Assignments, etc.  Only an authenticated User with 'admin' role can remove a Course. 
 *
 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.removeCourseById = (id) => {
  return new Promise(async (resolve, reject) => {
    try{
      const courseExist = await Course.countDocuments({ _id: id });

      if (courseExist != 1){
        throw new NotFoundError('Course not found.');
      }
      await Course.deleteOne({ _id: id });
      return resolve({'message': 'Course deleted successfully.'});
    }
    catch (error){
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Update data for a specific Course.
 * Performs a partial update on the data for the Course.  Note that enrolled students and assignments cannot be modified via this endpoint.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update Course information. 
 *
 * body Course Partial updates to be applied to the specified Course.

 * id id_1 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.updateCourseById = (body,id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const courseFields = extractValidFields(body, Course);
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: id },
        { $set: courseFields },
        { new: true, runValidators: true }
      );
      if (!updatedCourse) {
        throw new NotFoundError('Course not found.');
      }
      const response = {
        id: updatedCourse._id,
        subject: updatedCourse.subject,
        number: updatedCourse.number,
        title: updatedCourse.title,
        term: updatedCourse.term,
        instructorId: updatedCourse.instructorId,
        links: {
          course: `/courses/${updatedCourse._id}`
        }
      };

      return resolve(response);
    }
    catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}


/**
 * Update enrollment for a Course.
 * Enrolls and/or unenrolls students from a Course.  Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update the students enrolled in the Course. 
 *
 * body Id_students_body Arrays of User IDs for students to be enrolled/unenrolled in the Course.  Exact type/format of IDs will depend on your implementation but each will likely be either an integer or a string.

 * id id_2 Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string. 
 * no response value expected for this operation
 **/

exports.updateEnrollmentByCourseId = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!body.add && !body.remove) {
        throw new ValidationError('The request body was either not present or did not contain all the required fields.');
      }

      const course = await Course.findById(id);
      if (!course){
        throw new NotFoundError('Course not found.');
      }

      await updateEnrollmentForCourseId(id, body);

      const response = {
        message: 'Enrollment updated successfully.',
        links: {
          course: `/courses/${id}`
        }
      };

      return resolve(response);
    }
    catch (error) {
      return reject(await handleCourseError(error));
    }
  });
}

