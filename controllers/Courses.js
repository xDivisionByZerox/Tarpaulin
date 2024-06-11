'use strict';

var utils = require('../utils/writer.js');
var Courses = require('../service/CoursesService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');
const { rateLimiter } = require('../utils/ratelimiter.js');
const { isAdmin, isCourseInstructor } = require('../helpers/courseHelpers.js');
// Controllers call coresponding services, then passes response to Json writer to create response

module.exports.createCourse = function createCourse (req, res, next, body) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    .then(() => isAdmin(req.auth_role))
    .then(() => Courses.createCourse(body))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.getAllCourses = function getAllCourses (req, res, next, page, subject, number, term) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => Courses.getAllCourses(page, subject, number, term))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
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
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => Courses.getCourseById(id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.getRosterByCourseId = function getRosterByCourseId (req, res, next, id) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => isCourseInstructor(req.auth_role, req.user_id, id))
    .then(() => Courses.getRosterByCourseId(id, res))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    })
};

module.exports.getStudentsByCourseId = function getStudentsByCourseId (req, res, next, id) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => isCourseInstructor(req.auth_role, req.user_id, id))
    .then(() => Courses.getStudentsByCourseId(id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    })
};

module.exports.removeCourseById = function removeCourseById (req, res, next, id) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    .then(() => isAdmin(req.auth_role))
    .then(() => Courses.removeCourseById(id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.updateCourseById = function updateCourseById (req, res, next, body, id) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => isCourseInstructor(req.auth_role, req.user_id, id))
    .then(() => Courses.updateCourseById(body, id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.updateEnrollmentByCourseId = function updateEnrollmentByCourseId (req, res, next, body, id) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => isCourseInstructor(req.auth_role, req.user_id, id))
    .then(() => Courses.updateEnrollmentByCourseId(body, id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};
