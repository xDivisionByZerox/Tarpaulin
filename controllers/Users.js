'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
const { requireAuth, checkPermissions } = require('../utils/auth.js');

```
Controllers call coresponding services, then passes response to Json writer to create response
```

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  Users.authenticateUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createUser = function createUser (req, res, next, body) {
  ```
  If user has permissions to create a user, runs create user service
  ```
  checkPermissions(req, res, next, body).then(() => {
    Users.createUser(body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  });
};

module.exports.getUserById = function getUserById (req, res, next, id) {
  Users.getUserById(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
