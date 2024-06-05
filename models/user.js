const mongoose = require('mongoose');

/*
 * Schema for a Tarpaulin User
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        // Enum: [admin, instructor, student]
        type: String,
        required: true,
        enum: ['admin', 'instructor', 'student'],
        default: 'student'
    }
})
exports.UserSchema = UserSchema
