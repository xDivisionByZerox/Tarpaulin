const { ValidationError } = require('../utils/error.js');

module.exports.validateAgainstModel = function (obj, model) {
    return new Promise((resolve, reject) => {
        if (obj && model) {
            for (const key in model.schema.paths) {
                if (model.schema.paths[key].isRequired && !obj[key]) {
                    throw new ValidationError('Missing required field: ' + key);
                }
            }
            return resolve();
        } else {
        throw new ValidationError('Object not defined.');
        }
    });
}

module.exports.extractValidFields = function (obj, model) {
    const returnObj = {};
    for (const key in obj) {
        if (model.schema.paths[key]) {
            returnObj[key] = obj[key];
        }
    }
    return returnObj;
}
