
const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin Assignment
 */
const AssignmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String, 
        required: true,
        trim: true,
    },
    points: {
        type: Number,
        required: true,
    },
    due: {
        type: Date,
        required: true,
        trim: true,
        get: (due) => due.toISOString(), // change to ISO 8601 format
        set: function(due) {
            if (due instanceof Date) {
                return due;
            } else {
                return new Date(due);
            }
        }
    }
})
exports.AssignmentSchema = AssignmentSchema
