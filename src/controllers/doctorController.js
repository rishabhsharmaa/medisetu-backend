const Joi = require('joi');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Validation Schemas
const loginSchema = Joi.object({
    email: Joi.string().email().optional(),
    doctorId: Joi.string().optional(),
}).or('email', 'doctorId'); // Must provide at least one

const bookSchema = Joi.object({
    patientName: Joi.string().required(),
    phone: Joi.string().required(),
    age: Joi.number().optional(),
    gender: Joi.string().optional(),
    date: Joi.date().required(), // YYYY-MM-DD
    slot: Joi.string().required(),
    reason: Joi.string().optional(),
});

// @desc    Doctor Login (Simple)
// @route   POST /api/doctor/login
exports.login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { email, doctorId } = req.body;
        let doctor;

        if (email) {
            doctor = await Doctor.findOne({ email });
        } else if (doctorId) {
            // Assuming doctorId refers to the MongoDB _id
            doctor = await Doctor.findById(doctorId);
        }

        if (!doctor) {
            // Auto-create for simplicity if email is provided, 
            // but if only randomID provided and not found, maybe fail? 
            // Spec says "If not exists: auto-create". 
            // We'll proceed with auto-creation using email if available, or just fail for ID?
            // Let's assume input is usually email for auto-create.
            if (email) {
                doctor = await Doctor.create({
                    email,
                    name: 'New Doctor',
                });
            } else {
                res.status(404);
                throw new Error('Doctor not found');
            }
        }

        // Return dummy token
        res.status(200).json({
            success: true,
            message: 'Doctor login successful',
            token: 'dummy-jwt-token-' + doctor._id,
            data: doctor,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Book Appointment (Create Patient if needed)
// @route   POST /api/doctor/:doctorId/appointments
exports.bookAppointment = async (req, res, next) => {
    try {
        const { doctorId } = req.params;
        const { error } = bookSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { patientName, phone, age, gender, date, slot, reason } = req.body;

        // 1. Conflict Check
        // We need to match date strictly. 
        // Assuming date input "2023-10-27" works with standard Date parsing or string match if stored as string.
        // Ideally, we treat dates carefully. For this task, we assume the Date object matches.
        const appointmentDate = new Date(date);

        const conflict = await Appointment.findOne({
            doctorId,
            date: appointmentDate,
            slot,
            status: { $ne: 'Cancelled' }
        });

        if (conflict) {
            res.status(409).json({
                success: false,
                message: 'This slot is already booked'
            });
            return;
        }

        // 2. Find or Create Patient
        let patient = await Patient.findOne({ phoneNumber: phone });
        if (!patient) {
            patient = await Patient.create({
                name: patientName,
                phoneNumber: phone,
                age,
                gender
            });
        }

        // 3. Save Appointment
        const appointment = await Appointment.create({
            doctorId,
            patientId: patient._id,
            date: appointmentDate,
            slot,
            status: 'Scheduled',
            notes: reason // Mapping reason to notes or a separate field if model has it
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Get Doctor Appointments
// @route   GET /api/doctor/:doctorId/appointments
exports.getDoctorAppointments = async (req, res, next) => {
    try {
        const { doctorId } = req.params;
        const { q, status, date, sort, page = 1, limit = 10 } = req.query;

        let query = { doctorId };

        if (status) {
            // e.g. "Scheduled|CheckedIn" logic? User said "?status=Scheduled|CheckedIn|Completed"
            // This implies single value selection usually, or OR logic.
            // Let's assume strict match or $in if regex.
            query.status = status;
        }

        if (date) {
            query.date = new Date(date);
        }

        // For "search: ?q= (patientName / phone)", we need to lookup patients first OR use aggregation.
        // Mongoose 'populate' filter is easier but less efficient for large data.
        // Given the task scale, let's fetch matching patients first if q is present.
        if (q) {
            const matchingPatients = await Patient.find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { phoneNumber: { $regex: q, $options: 'i' } }
                ]
            }).select('_id');

            const patientIds = matchingPatients.map(p => p._id);
            query.patientId = { $in: patientIds };
        }

        // Sorting
        let sortOptions = { date: -1 }; // default
        if (sort === 'slot_asc') sortOptions = { slot: 1 };
        if (sort === 'created_desc') sortOptions = { createdAt: -1 };

        const skip = (page - 1) * limit;

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name phoneNumber age gender')
            .sort(sortOptions)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Doctor appointments fetched successfully',
            count: appointments.length,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            },
            data: appointments,
        });

    } catch (err) {
        next(err);
    }
};
