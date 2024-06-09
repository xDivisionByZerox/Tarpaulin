class ServerError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends ServerError { // 400
    constructor(message) {
        super(message, 400);
    }
}

class CredentialsError extends ServerError { // 401
    constructor(message) {
        super(message, 401);
    }
}

class PermissionError extends ServerError { // 403
    constructor(message) {
        super(message, 403);
    }
}


module.exports = {
    ServerError,
    ValidationError,
    CredentialsError,
    PermissionError
}
