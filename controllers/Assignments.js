'use strict';

var utils = require('../utils/writer.js');
var Assignments = require('../service/AssignmentsService');
const { errorHandler }= require('../middleware/errorHandler');
const { rateLimiter } = require('../utils/ratelimiter.js');
const { isAssignmentInstructor } = require('../helpers/assignmentHelpers.js');
const { requireAuth, checkPermissions } = require('../utils/auth.js');

// Controllers call coresponding services, then passes response to Json writer to create response

module.exports.createAssignment = function createAssignment (req, res, next, body) {

  Assignments.createAssignment(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createSubmission = function createSubmission (req, res, next, body, id) {
  Assignments.createSubmission(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAssignmentById = function getAssignmentById (req, res, next, id) {
  Assignments.getAssignmentById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSubmissionsByAssignmentId = function getSubmissionsByAssignmentId (req, res, next, id, page, studentId) {
  rateLimiter(req, res, next)
    .then(() => requireAuth(req, res, next))
    .then(() => checkPermissions(req, res, next))
    .then(() => isAssignmentInstructor(req.auth_role, req.user_id, id))
    .then(()=> Assignments.getSubmissionsByAssignmentId(id, page, studentId))
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((error) => {
      errorHandler(res, error);
    })
};

module.exports.removeAssignmentsById = function removeAssignmentsById (req, res, next, id) {
  Assignments.removeAssignmentsById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateAssignmentById = function updateAssignmentById (req, res, next, body, id) {
  Assignments.updateAssignmentById(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
