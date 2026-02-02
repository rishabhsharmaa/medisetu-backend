const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    // Optional: Link to a doctor or appointment if needed, but requirements satisfy just patientId
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    complaint: {
        type: String,
    },
    noteText: {
        type: String,
    },
    vitals: {
        bp: String,
        pulse: String,
        temperature: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);
