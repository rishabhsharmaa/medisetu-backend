const Joi = require('joi');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// @desc    Book Appointment
// @route   POST /api/appointments/book
exports.bookAppointment = async (req, res, next) => {
    try {
        const { patientId, doctorId, date, slot } = req.body;

        // Validate Input
        if (!patientId || !doctorId || !date || !slot) {
            res.status(400);
            throw new Error('All fields are required');
        }

        // Conflict Check
        const conflict = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            slot,
            status: { $ne: 'Cancelled' }
        });

        if (conflict) {
            res.status(409).json({
                success: false,
                message: 'Conflict: Slot already booked'
            });
            return;
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date: new Date(date),
            slot,
            status: 'Scheduled'
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    List Appointments
// @route   GET /api/appointments
exports.getAppointments = async (req, res, next) => {
    try {
        const { doctorId, date, status } = req.query;
        let query = {};

        if (doctorId) query.doctorId = doctorId;
        if (status) query.status = status;
        if (date) query.date = new Date(date);

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name phoneNumber')
            .sort({ slot: 1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update Status
// @route   PATCH /api/appointments/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Save Vitals & Notes
// @route   POST /api/appointments/:id/vitals
exports.saveVitals = async (req, res, next) => {
    try {
        const { bp, pulse, temp, notes } = req.body;

        // Construct vitals object
        const vitals = {};
        if (bp) vitals.bp = bp;
        if (pulse) vitals.pulse = pulse;
        if (temp) vitals.temp = temp;

        const updateFields = {};
        if (Object.keys(vitals).length > 0) updateFields.vitals = vitals;
        if (notes) updateFields.notes = notes;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        res.status(200).json({
            success: true,
            message: 'Medical data saved',
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};
