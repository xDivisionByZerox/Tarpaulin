'use strict';

var utils = require('../utils/writer.js');
var Assignments = require('../service/AssignmentsService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');
const { errorHandler }= require('../middleware/errorHandler');
const { rateLimiter } = require('../utils/ratelimiter.js');
const { isAdmin, isAdminOrInstructor, isCourseInstructor, isAssignmentInstructor } = require('../helpers/assignmentHelpers.js');

// Controllers call coresponding services, then passes response to Json writer to create response

module.exports.createAssignment = function createAssignment (req, res, next, body) {
  rateLimiter(req, res, next)
  .then(() => requireAuth(req, res, next))
  .then(() => checkPermissions(req, res, next))
  .then(() => isCourseInstructor(req.auth_role, req.user_id, body.courseId)) //
  .then(() => Assignments.createAssignment(body))
  .then((response) => {
    utils.writeJson(res, response);
  })
  .catch((error) => {
    errorHandler(res, error);
  });
};

module.exports.createSubmission = function createSubmission (req, res, next, body, id) {
  rateLimiter(req, res, next)
  .then(() => requireAuth(req, res, next))
  .then(() => checkPermissions(req, res, next))
  // .then(() => isCourseInstructor(req.auth_role, req.user_id, body.courseId))//
  .then(() => Assignments.createSubmission(body, id))
  .then((response) => {
    utils.writeJson(res, response);
  })
  .catch((error) => {
    errorHandler(res, error);
  });
};

module.exports.getAssignmentById = function getAssignmentById (req, res, next, id) {
    rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    .then(() => Assignments.getAssignmentById(body, id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.getSubmissionsByAssignmentId = function getSubmissionsByAssignmentId (req, res, next, id, page, studentId) {
    rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    .then(() => isCourseInstructor(req.auth_role, req.user_id, body.courseId))
    .then(() => Assignments.getSubmissionsByAssignmentId(body, id, page, studentId))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.removeAssignmentsById = function removeAssignmentsById (req, res, next, id) {
    rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    // .then(() => isCourseInstructor(req.auth_role, req.user_id, body.courseId))
    .then(() => Assignments.removeAssignmentsById(body, id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });
};

module.exports.updateAssignmentById = function updateAssignmentById (req, res, next, body, id) {
    rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    // .then(() => isCourseInstructor(req.auth_role, req.user_id, body.courseId))
    .then(() => Assignments.updateAssignmentById(body, id))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    });

};
