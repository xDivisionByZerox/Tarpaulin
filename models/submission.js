const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin Assignment Submission
 */
const SubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Possibly add middleware to ensure a user/admin, though not really needed
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Unsure if this is when request made or schema defined
    },
    grade: {
        type: Number // Added by instructor w/ update call
    },
    file: {
        // When created: binary data in file
        // When returned: URL to file
        type: String,
        required: true
    }
})
const Submission = mongoose.model('Submission', SubmissionSchema)
exports.Submission = Submission