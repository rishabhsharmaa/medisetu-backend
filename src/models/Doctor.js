const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: 'Dr. Guest',
    },
    specialization: {
        type: String,
        default: 'General Physician',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);
