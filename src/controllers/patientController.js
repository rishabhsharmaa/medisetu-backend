const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Note = require('../models/Note');

// @desc    Login / Auto-Register
// @route   POST /api/patients/login
exports.login = async (req, res, next) => {
    try {
        const { phoneNumber, name, age, gender } = req.body;
        let patient = await Patient.findOne({ phoneNumber });

        if (!patient) {
            patient = await Patient.create({
                phoneNumber,
                name: name || 'Guest',
                age,
                gender
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Profile
// @route   GET /api/patients/:id/profile
exports.getProfile = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404);
            throw new Error('Patient not found');
        }
        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get History
// @route   GET /api/patients/:id/history
exports.getHistory = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.id })
            .populate('doctorId', 'name specialization')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Note (Notes + Vitals)
// @route   POST /api/patients/:patientId/notes
exports.createNote = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { complaint, noteText, vitals } = req.body;

        const note = await Note.create({
            patientId,
            complaint,
            noteText,
            vitals
        });

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: note
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Patient Notes History
// @route   GET /api/patients/:patientId/notes
exports.getNotes = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { page = 1, limit = 10, sort = 'latest' } = req.query;

        let sortOption = { createdAt: -1 }; // Default latest first
        if (sort === 'oldest') sortOption = { createdAt: 1 };

        const skip = (page - 1) * limit;

        const notes = await Note.find({ patientId })
            .sort(sortOption)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Note.countDocuments({ patientId });

        res.status(200).json({
            success: true,
            count: notes.length,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            },
            data: notes
        });
    } catch (err) {
        next(err);
    }
};
