const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    slot: {
        type: String, // e.g., "10:00 AM"
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
    vitals: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

// Compound index to quickly check for availability
appointmentSchema.index({ doctorId: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
