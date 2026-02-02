const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: 'Guest Patient', // Default name if auto-created without extra info
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Patient', patientSchema);
