'use strict';

var utils = require('../utils/writer.js');
var Courses = require('../service/CoursesService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');
const { rateLimiter } = require('../utils/ratelimiter.js');
const { isAuthorizedToCreateCourse } = require('../helpers/courseHelpers.js');
// Controllers call coresponding services, then passes response to Json writer to create response

module.exports.createCourse = function createCourse (req, res, next, body) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next, 'admin'))
    .then(() => isAuthorizedToCreateCourse(req.auth_role))
    .then(() => Courses.createCourse(body))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.getAllCourses = function getAllCourses (req, res, next, page, subject, number, term) {
  Courses.getAllCourses(page, subject, number, term)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssignmentsByCourseId = function getAssignmentsByCourseId (req, res, next, id) {
  Courses.getAssignmentsByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCourseById = function getCourseById (req, res, next, id) {
  Courses.getCourseById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRosterByCourseId = function getRosterByCourseId (req, res, next, id) {
  Courses.getRosterByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getStudentsByCourseId = function getStudentsByCourseId (req, res, next, id) {
  Courses.getStudentsByCourseId(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeCourseById = function removeCourseById (req, res, next, id) {
  Courses.removeCourseById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateCourseById = function updateCourseById (req, res, next, body, id) {
  Courses.updateCourseById(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateEnrollmentByCourseId = function updateEnrollmentByCourseId (req, res, next, body, id) {
  Courses.updateEnrollmentByCourseId(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
