function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const errorResponse = {
    code: 500,
    message: 'Internal Server Error'
  };

  if (err instanceof ValidationError) {
    errorResponse.code = 400;
    errorResponse.message = err.message;
  } else if (err instanceof PermissionError) {
    errorResponse.code = 403;
    errorResponse.message = err.message;
  } else if (err instanceof ConflictError) {
    errorResponse.code = 409;
    errorResponse.message = err.message;
  }

  utils.writeJson(res, errorResponse);
}

module.exports.errorHandler = errorHandler;
