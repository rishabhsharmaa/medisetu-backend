const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Normal', 'Abnormal', 'Pending'],
        default: 'Pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    fileUrl: {
        type: String, // Simulated URL
    },
    // Optional report values (e.g., Hemoglobin: 12.5)
    values: [{
        name: String,
        value: String,
        unit: String,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
