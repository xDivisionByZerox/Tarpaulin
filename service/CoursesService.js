'use strict';


/**
 * Create a new course.
 * Creates a new Course with specified data and adds it to the application's database.  Only an authenticated User with 'admin' role can create a new Course. 
 *
 * body Course A Course object.
 * returns inline_response_201_1
 **/
exports.createCourse = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "id" : "123"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.getAllCourses = function(page,subject,number,term) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "courses" : [ {
    "number" : "493",
    "subject" : "CS",
    "term" : "sp22",
    "title" : "Cloud Application Development",
    "instructorId" : "123"
  }, {
    "number" : "493",
    "subject" : "CS",
    "term" : "sp22",
    "title" : "Cloud Application Development",
    "instructorId" : "123"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.getAssignmentsByCourseId = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "assignments" : [ {
    "due" : "2022-06-14T17:00:00-07:00",
    "title" : "Assignment 3",
    "courseId" : "123",
    "points" : 100
  }, {
    "due" : "2022-06-14T17:00:00-07:00",
    "title" : "Assignment 3",
    "courseId" : "123",
    "points" : 100
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.getCourseById = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "number" : "493",
  "subject" : "CS",
  "term" : "sp22",
  "title" : "Cloud Application Development",
  "instructorId" : "123"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.getRosterByCourseId = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "123,\"Jane Doe\",doej@oregonstate.edu\n...\n";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.getStudentsByCourseId = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "students" : [ {
    "password" : "hunter2",
    "role" : "student",
    "name" : "Jane Doe",
    "email" : "doej@oregonstate.edu"
  }, {
    "password" : "hunter2",
    "role" : "student",
    "name" : "Jane Doe",
    "email" : "doej@oregonstate.edu"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.removeCourseById = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
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
exports.updateCourseById = function(body,id) {
  return new Promise(function(resolve, reject) {
    resolve();
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
exports.updateEnrollmentByCourseId = function(body,id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

