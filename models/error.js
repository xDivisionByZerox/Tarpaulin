const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin Error
 *
 * Notes:
 * Seems overcomplicated to store in DB but was a component in the schema
 * Simpler solution would be to have a file with all the errors in it
 */
const ErrorSchema = new mongoose.Schema({
    error: {
        type: String,
        required: true
    }
})
const error = mongoose.model('Error', ErrorSchema)
exports.error = error
