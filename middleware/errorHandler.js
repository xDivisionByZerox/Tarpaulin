const {ValidationError, CredentialsError, PermissionError, NotFoundError, ConflictError} = require('../utils/error.js');

module.exports.errorHandler = function errorHandler(err, res) {
  console.error('Error handler received:\n', err);

  const errorResponse = {
    code: 500,
    message: 'Internal Server Error'
  };

  if (err instanceof ValidationError) {
    errorResponse.code = 400;
    errorResponse.message = err.message;
  } 
  else if (err instanceof CredentialsError) {
    errorResponse.code = 401;
    errorResponse.message = err.message;
  }
  else if (err instanceof PermissionError) {
    errorResponse.code = 403;
    errorResponse.message = err.message;
  }
  else if (err instanceof NotFoundError) {
    errorResponse.code = 404;
    errorResponse.message = err.message;
  } 
  else if (err instanceof ConflictError) {
    errorResponse.code = 409;
    errorResponse.message = err.message;
  }

  res.status(errorResponse.code).json({ error: errorResponse.message });
}

